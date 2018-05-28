import React, { Component } from 'react'
import { connect } from 'react-redux'
import Slider from 'react-compound-slider'
import { Handle, Track, Tick } from './Slider'
import _ProgressBar from './_ProgressBar'
import ReactGA from 'react-ga';

const sliderStyle = {  // Give the slider some width
      position: 'relative',
      width: '100%',
      height: 80,
}

const railStyle = {
      position: 'absolute',
      width: '100%',
      height: 8,
      marginTop: 35,
      borderRadius: 5,
      backgroundColor: '#ddd',
}


class Destination extends Component {

    constructor(props) {
        super(props)
        this.state = {
            from: 50,
            to: 100,
            category: 'default'
        }
    }

    componentWillMount() {
        if (!process.env.DEVELOPMENT) {
            ReactGA.initialize('UA-xxxxxx')
            ReactGA.pageview('/planning/new/destination')
        }
        this.fetchDestinations()
    }

    fetchDestinations = () => {
        this.props.fetchDestinations(
            this.state.from,
            this.state.to,
            (this.state.category == 'default') ? null : this.state.category
        )
    }

    _selectDestination = (destination) => {
        this.setState({
            ...this.state,
            destinationId: destination.id,
            destination: destination
        })

        let position
        if ($('#cta').offset()) {
            position = $('#cta').offset().top
        } else {
            position = 700
        }
        $("html, body").stop().animate(
            { scrollTop: position}, 500, "swing"
        )
        return false
    }

    _setCategory = (event) => {
        this.setState({
            ...this.state,
            category: event.target.value
        }, () => this.fetchDestinations())
    }

    _renderSpot() {
        if (!this.props.destinations) { return }

        return (
            <ul>
                {this.props.destinations.map(destination =>
                    <li key={destination.id}>
                        <label>
                            <input type="radio" name='spot' onClick={() => this._selectDestination(destination) }/>
                            <img src={destination.photo_url} />
                            <span>{destination.title}</span>
                        </label>
                    </li>
                )}
            </ul>
        )
    }

    _setDistance = (values) => {
        let checkedItem = $('input[type="radio"]:checked')[0]
        if (checkedItem) { checkedItem.checked = false }

        this.setState({
            ...this.state,
            from: values[0],
            to: values[1],
            destinationId: null
        })

        this.fetchDestinations()
    }

    _renderSpotDetail = () => {
        if (this.state.destinationId) {
            const link = "https://maps.google.com/maps/place/" + this.state.destination.latitude + "," + this.state.destination.longitude + "/" + this.state.destination.latitude + "," + this.state.destination.longitude + ',12z'
            return (
                <div>
                    <a href={link} target="_blank" className='map-link'>
                        <span>{this.state.destination.address}</span>
                        <span className='text-detail'> (詳細を確認)</span>
                    </a>
                    <p className='distance'>出発地点からの距離 {this.state.destination.distance}km</p>
                </div>
            )
        }
    }

    _renderCta = () => {
        if (this.state.destinationId) {
            return (
                <div className='cta-section'>
                    <a id='cta' onClick={() => this.props.onSubmit({ destinationId: this.state.destinationId })}>
                        <span>ここを最終目的地にする</span>
                    </a>
                </div>
            )
        } else {
            return (
                <div className='cta-section'>
                    <a className='disabled-btn'>
                        <span>最終目的地を選択してください</span>
                    </a>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                <div className='title-section'>
                    <h1 className='one'>
                        <span>出発地から{this.state.from}km~{this.state.to}kmの目的地です</span>
                    </h1>
                </div>

                <div className='slider-section'>
                    <Slider
                        rootStyle={sliderStyle}
                        domain={[0, 200]}
                        values={[50, 100]}
                        step={10}
                        onChange={(values) => this._setDistance(values)}
                    >
                        <Slider.Rail>
                            {({ getRailProps }) => (
                                <div style={railStyle} {...getRailProps()} />
                            )}
                        </Slider.Rail>
                        <Slider.Handles>
                            {({ handles, getHandleProps }) => (
                                <div className="slider-handles">
                                    {handles.map(handle => (
                                        <Handle
                                            key={handle.id}
                                            handle={handle}
                                            getHandleProps={getHandleProps}
                                        />
                                    ))}
                                </div>
                            )}
                        </Slider.Handles>
                        <Slider.Tracks right={false} left={false}>
                            {({ tracks, getTrackProps }) => (
                                <div className="slider-tracks">
                                    {tracks.map(({ id, source, target }) => (
                                        <Track
                                            key={id}
                                            source={source}
                                            target={target}
                                            getTrackProps={getTrackProps}
                                        />
                                    ))}
                                </div>
                            )}
                        </Slider.Tracks>
                        <Slider.Ticks count={4}>
                            {({ ticks }) => (
                                <div className="slider-ticks">
                                {ticks.map(tick => (
                                    <Tick key={tick.id} tick={tick} count={ticks.length} />
                                ))}
                                </div>
                            )}
                        </Slider.Ticks>
                    </Slider>
                </div>

                <div className='filter-category-section'>
                    <select className="form-control" onChange={(event) => this._setCategory(event)} value={this.state.category}>
                        <option value='default'>カテゴリーを選択...</option>
                        <option value='restaurant'>グルメ</option>
                        <option value='park'>公園</option>
                        <option value='others'>その他(商業施設など)</option>
                    </select>
                </div>

                <div className='destination-photos-section'>
                    {this._renderSpot()}
                </div>

                <div className='destination-detail-section'>
                    {this._renderSpotDetail()}
                </div>
                {this._renderCta()}
                <_ProgressBar position={2} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        startPosition: state && state.startPosition,
        destinations: state && state.destinations
    }
}

export default connect(mapStateToProps)(Destination)
