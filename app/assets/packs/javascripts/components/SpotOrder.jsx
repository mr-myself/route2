import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    SortableContainer,
    SortableElement,
    arrayMove
} from 'react-sortable-hoc'
import { SortableList } from './_Sortable'
import iconMarker from 'packs/images/icon-marker'
import iconUpdate from 'packs/images/icon-update'
import iconArrowDown from 'packs/images/icon-arrow-down'
import _ProgressBar from './_ProgressBar'
import ReactGA from 'react-ga';

let map
let markers = []
let directionsService = new google.maps.DirectionsService
let directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers : true })


class SpotOrder extends Component {

    constructor(props) {
        super(props)
        this.state = {
            initial: true
        }
    }

    componentWillMount() {
        if (!process.env.DEVELOPMENT) {
            ReactGA.initialize('UA-xxxxxx')
            ReactGA.pageview('/planning/new/spot_order')
        }
    }

    componentDidMount() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: {
                lat: this.props.centerPosition[0],
                lng: this.props.centerPosition[1]
            }
        })
        directionsDisplay.setMap(map)
        this.showRoute()
    }

    directionServiceParams = () => {
        return {
            origin: new google.maps.LatLng(
                this.props.startPosition.lat,
                this.props.startPosition.lng
            ),
            destination: new google.maps.LatLng(
                this.destination().latitude,
                this.destination().longitude
            ),
            travelMode: 'WALKING',
            avoidHighways: true,
            avoidTolls: true,
            unitSystem: google.maps.UnitSystem.METRIC,
            optimizeWaypoints: this.state.initial,
            provideRouteAlternatives: false,
            waypoints: this.waypoints()
        }
    }

    selectedSpotsObjects = () => {
        // Find spots based on the order of selectedSpots(id)
        return this.props.selectedSpots.map(spotId => {
            return this.props.spots.find(spot => {
                return spot.id == spotId
            })
        })
    }

    waypoints = () => {
        return this.selectedSpotsObjects().map(spot => {
            return {
                location: new google.maps.LatLng(
                    spot.latitude,
                    spot.longitude
                ),
                stopover: true
            }
        })
    }

    destination = () => {
        return this.props.spots.find(spot => {
            return this.props.destinationId == spot.id
        })
    }

    showRoute = () => {
        const that = this
        directionsService.route(
            this.directionServiceParams(),
            function(response, status) {
                if (status === 'OK') {
                    directionsDisplay.setDirections(response)
                    that.showWaypointsOnMap()
                    that.showStartPositionOnMap()
                    that.setElevation()
                    that.setDistance(response)
                    that.setSteps(response)
                    that.showDestinationOnMap()
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            }
        );
    }

    setSteps = (response) => {
        if (this.state.initial) {
            // To enable optimizeWaypoints
            const waypointOrder = response['routes'][0]['waypoint_order']
            if (waypointOrder.length > 0) {
                const selectedSpots = this.selectedSpotsObjects()
                let newOrderIds = []
                waypointOrder.forEach((index) => {
                    newOrderIds.push(selectedSpots[index]['id'])
                })
                this.props.updateSelectedSpot(newOrderIds)
            }
        }

        const steps = response['routes'][0]['overview_path'].map((latlng) => {
            return {
                latitude: latlng['lat'](),
                longitude: latlng['lng']()
            }
        })

        this.setState({
            ...this.state,
            steps: steps,
            waypointsInfo: response['routes'][0]['legs'],
            initial: false
        })
    }

    setElevation = () => {
        let elevator = new google.maps.ElevationService
        const destination = this.destination()
        const spotLatLngs = this.selectedSpotsObjects().map(spot => {
            return {
                lat: spot.latitude,
                lng: spot.longitude
            }
        })
        elevator.getElevationAlongPath({
            'path': spotLatLngs.concat(
                {
                    lat: this.props.startPosition.lat,
                    lng: this.props.startPosition.lng
                }).concat({
                    lat: destination.latitude,
                    lng: destination.longitude
                }),
            'samples': 256
        }, (elevations, status) => {
            if (status !== 'OK') { return }
            let sum = 0
            let previousElevation = 0

            elevations.map(elevation => {
                if (previousElevation < elevation['elevation']) {
                    sum = sum + (elevation['elevation'] - previousElevation)
                }
                previousElevation = elevation['elevation']
            })
            this.setState({
                ...this.state,
                elevation: sum.toFixed(1)
            })
        });
    }

    setDistance = (response) => {
        let sum = 0
        response['routes'][0]['legs'].map((route) => {
            sum = sum + route['distance']['value']
        })
        this.setState({
            ...this.state,
            distance: (sum/1000).toFixed(1)
        })
    }

    showStartPositionOnMap = () => {
        const infowindow = new google.maps.InfoWindow({
            content: '出発地点'
        })
        const marker = new google.maps.Marker({
            position: this.props.startPosition,
            draggable: false,
            map: map
        })
        markers.push(marker)
        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });
    }

    showDestinationOnMap = () => {
        const infowindow = new google.maps.InfoWindow({
            content: '目的地'
        })
        const destination = this.destination();
        const marker = new google.maps.Marker({
            position: {
                lat: destination.latitude,
                lng: destination.longitude
            },
            draggable: false,
            map: map
        })
        markers.push(marker)
        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });
    }

    showWaypointsOnMap = () => {
        this.removeAllMarkers()
        this.selectedSpotsObjects().map(spot => {
            const infowindow = new google.maps.InfoWindow({
                content: spot.title
            })
            const iconImage = {
                url: iconMarker,
                scaledSize: new google.maps.Size(20, 40),
                origin: null,
                anchor: null
            }
            const marker = new google.maps.Marker({
                position: { lat: spot.latitude, lng: spot.longitude },
                draggable: false,
                title: spot.title,
                icon: iconImage,
                map: map
            })
            markers.push(marker)
            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });
        })
    }

    removeSpot = (id) => {
        let newState = this.props.selectedSpots.concat()
        const index = this.props.selectedSpots.indexOf(id)
        if (index !== -1) {
            newState.splice(index, 1) // returns deleted ones as array
        }
        if (this.props.selectedSpots.length == 0) {
            newState = []
        }
        this.props.updateSelectedSpot(newState)
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.props.updateSelectedSpot(
            arrayMove(this.props.selectedSpots, oldIndex, newIndex),
        )
    }

    removeAllMarkers() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }

    refreshMap = () => {
        $("html, body").stop().animate(
            { scrollTop: 0 }, 500, "swing"
        )
        this.showRoute()
    }


    render() {
        return (
            <div>
                <div className='title-section'>
                    <h1 className='one'>
                        <span>経由地の順序を決めましょう</span>
                    </h1>
                </div>

                <div className='spot-order-map-section'>
                    <div id='map' />
                </div>

                <div className='route-analytics-section flex'>
                    <div className='elevation-section'>
                        <span className='title'>獲得標高(目安)</span>
                        <span className='data'>{this.state && this.state.elevation}M</span>
                    </div>
                    <div className='duration-section'>
                        <span className='title'>所要時間(20km/h)</span>
                        <span className='data'>約{this.state && this.state.distance && ((this.state.distance)/20).toFixed(1)}時間</span>
                    </div>
                </div>

                <div className='sortable-section' key={this.props.selectedSpots}>
                    <div className='fixed-position'>
                        <div className='title-description'>出発地点</div>
                        <span className='title'>{this.props.startAddress}</span>
                    </div>

                    <div className='arrow'>
                        <img src={iconArrowDown} className='icon-arrow-down' />
                    </div>

                    <p className='description'>ドラッグ＆ドロップで経由地の順序が変更できます</p>

                    <SortableList
                        items={this.selectedSpotsObjects()}
                        removeSpot={this.removeSpot}
                        helperClass={'sorting-element'}
                        onSortEnd={this.onSortEnd}
                        waypointsInfo={this.state && this.state.waypointsInfo}
                        pressDelay={300}
                    />
                    <div className='previous-step-section'>
                        <button onClick={() => this.props.previousStep()}>
                            <span>+ 経由地を追加する</span>
                        </button>
                    </div>
                    <div>
                        <div className='arrow'>
                            <img src={iconArrowDown} className='icon-arrow-down' />
                        </div>
                        <div className='fixed-position'>
                            <div className='title-description'>目的地</div>
                            <span className='title'>{this.destination().title}</span>
                        </div>
                    </div>
                </div>

                <div className='fixed-cta-section'>
                    <div className='update-route half-button left'>
                        <button onClick={this.refreshMap}>
                            <img src={iconUpdate} className='icon-update' />
                            <span>ルートを更新する</span>
                        </button>
                    </div>
                    <div className='finish-spot-order half-button right'>
                        <button onClick={() => this.props.onSubmit(this.state.distance, this.state.elevation, this.state.steps)}>
                            <span>この順序で完成する</span>
                        </button>
                    </div>
                </div>

                <_ProgressBar position={4} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        startPosition: state && state.startPosition,
        startAddress: state && state.startAddress,
        destinationId: state && state.destinationId,
        selectedSpots: (state && state.selectedSpots) || [],
        centerPosition: state && state.centerPosition,
        spots: state && state.spots
    }
}

export default connect(mapStateToProps)(SpotOrder)
