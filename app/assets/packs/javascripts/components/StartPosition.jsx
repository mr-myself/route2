import React, { Component } from 'react'
import { connect } from 'react-redux'
import iconRoadbike from 'packs/images/icon-roadbike'
import iconSearch from 'packs/images/icon-search'
import iconStartPosition from 'packs/images/icon-start-position'
import _ProgressBar from './_ProgressBar'
import ReactGA from 'react-ga';

var map, searchBox, marker

class StartPosition extends Component {

    constructor(props) {
        super(props)
        this.state = {
            mapLoaded: false,
            mapZoom: 16,
            currentPosition: {
                lat: 35.6811673,
                lng: 139.7648576
            },
            address: ''
        }
    }

    componentWillMount() {
        if (!process.env.DEVELOPMENT) {
            ReactGA.initialize('UA-xxxxxx')
            ReactGA.pageview('/planning/new/start_position')
        }
    }

    componentDidMount() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: this.state.currentPosition,
            zoom: this.state.mapZoom
        });

        const input = document.getElementById('search-box');
        searchBox = new google.maps.places.SearchBox(input);
        searchBox.addListener(
            'places_changed', this.setStartPosition
        )

        const that = this
        if (navigator.geolocation) {
            console.log('HTML5 is supported.')
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.setState({
                        ...this.state,
                        mapLoaded: true,
                        currentPosition: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })

                    that.putInfoWindowOnMap()
                    that.showMarkerAtStartPosition()
                    that.fetchAddressNameBy()
                    map.setCenter(this.state.currentPosition)
                },
                () => {
                    console.log('Failed getCurrentPosition')
                    that.showMarkerAtStartPosition();
                    that.fetchAddressNameBy();
                    this.setState({
                        ...this.state,
                        mapLoaded: true
                    })
                    map.setCenter(this.state.currentPosition)
                },
                {
                    enableHighAccuracy: false,
                    timeout: 3000,
                    maximumAge: 600000 // cache milli sec
                }
            );
        } else {
            console.log('HTML5 is not supported.')
        }
    }

    showMarkerAtStartPosition = () => {
        if (marker) { marker.setMap(null) }

        const image = {
            url: iconStartPosition,
            scaledSize: new google.maps.Size(60, 40),
            origin: null,
            anchor: null
        }
        marker = new google.maps.Marker({
            position: this.state.currentPosition,
            draggable: true,
            icon: image,
        })
        marker.setMap(map);

        google.maps.event.addListener(marker, 'dragend', (event) => {
            this.setState({
                ...this.state,
                currentPosition: {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                }
            })
            this.fetchAddressNameBy()
        })
    }

    putInfoWindowOnMap = () => {
        let infoWindow = new google.maps.InfoWindow({ map: map })
        infoWindow.setPosition(this.state.currentPosition)
        infoWindow.setContent('現在地')
    }

    fetchAddressNameBy = () => {
        let geocoder = new google.maps.Geocoder;

        geocoder.geocode({ 'location': this.state.currentPosition }, (results, status) => {
            if (status === 'OK') {
                const address = results[0].formatted_address.replace(/(.+?)\s/, '')
                if (results[1]) {
                    this.setState({ ...this.state, address: address })
                } else {
                    window.alert('住所名が正しく取得できませんでした');
                }
            } else {
                console.error('ERROR', status)
                window.alert('住所名が正しく取得できませんでした');
            }
        });
    }

    setStartPosition = () => {
        const places = searchBox.getPlaces();

        if (places.length == 0) { return; }

        this.setState({
            ...this.state,
            currentPosition: {
                lat: places[0].geometry.viewport.f.f,
                lng: places[0].geometry.viewport.b.b
            },
            address: places[0].formatted_address.replace(/(.+?)\s/, '')
        })

        this.showMarkerAtStartPosition();
        map.setCenter(this.state.currentPosition)
    }

    render() {
        return (
            <div>
                <div className='title-section'>
                    <h1 className='one'>
                        <span>出発地点を決めましょう</span>
                    </h1>
                    <p>ピンをドラッグ&ドロップするか、検索ボックスから場所を入力して移動できます</p>
                </div>

                <div className='start-location-map-section'>
                    <div className='searchbox-section'>
                        <input type='text' className='form-control' placeholder='出発地点を検索...' ref='search_box' id='search-box' />
                        <img src={iconSearch} className='search-btn' />
                    </div>

                    <div className='map-view'>
                        <div id='map' />
                    </div>

                    <div className='location-information'>
                        <span>{this.state.address}</span>
                    </div>
                </div>

                <div className='cta-section'>
                    {this.state.mapLoaded &&
                        <a onClick={() => this.props.onSubmit({
                            startPosition: this.state.currentPosition,
                            startAddress: this.state.address
                        })}>
                            <span>出発地点に設定する</span>
                        </a>
                    }
                    {!this.state.mapLoaded &&
                        <a className='disabled-btn'>
                            <span>マップを読み込み中...</span>
                        </a>
                    }
                </div>
                <_ProgressBar position={1} />
            </div>
        )
    }
}

export default connect()(StartPosition)
