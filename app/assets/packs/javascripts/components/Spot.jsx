import React, { Component } from 'react'
import { connect } from 'react-redux'
import Cards, { Card } from 'react-swipe-card'
import iconGoing from 'packs/images/going'
import iconNotGoing from 'packs/images/not_going'
import iconAllSpotsFinished from 'packs/images/all_spots_finished'
import _ProgressBar from './_ProgressBar'
import ReactGA from 'react-ga';

class Spot extends Component {

    constructor(props) {
        super(props)
        this.state = {
            spots: [],
            swipeCompleted: false,
            initialSelectedSpots: []
        }
    }

    componentWillMount() {
        if (!process.env.DEVELOPMENT) {
            ReactGA.initialize('UA-xxxxxx')
            ReactGA.pageview('/planning/new/spot')
        }

        this.setState({
            ...this.state,
            initialSelectedSpots: this.props.selectedSpots
        })
        this.props.fetchSpots()
        this.props.calculateCenterPosition()
    }

    _swipeRight = (spotId) => {
        this.props.pickSpotUp(spotId)
    }

    _renderNoSpots() {
        if (
            (this._candidateSpots() &&
             this._candidateSpots().length == 0 &&
             this.state.initialSelectedSpots.length !== 0
            ) ||
            this.state.swipeCompleted ||
            (this.props.selectedSpots.length >= 20)
        ) {
            $('.swipe-root').hide()
            $('.swipe-indicator-section').hide()

            return (
                <div className='no-spots'>
                    <img src={iconAllSpotsFinished} />
                </div>
            )
        }
    }

    _alertRight() {
        return <span>行きたい</span>
    }

    _alertLeft() {
        return <span>行かない</span>
    }

    _candidateSpots = () => {
        if (this.state.initialSelectedSpots.length == 0) {
            return this.props.spots
        } else {
            return this.props.spots.filter(spot => {
                return !this.state.initialSelectedSpots.includes(spot.id)
            })
        }
    }

    _renderSpot = () => {
        if (!this.props.spots) { return }
        if (this._candidateSpots().length == 0) { return }
        if (this.props.selectedSpots.length >= 20) { return }

        return (
            <div>
                <Cards
                    onEnd={() => this.setState({
                        ...this.state, swipeCompleted: true
                    })}
                    className='swipe-root'
                    alertRight={this._alertRight()}
                    alertLeft={this._alertLeft()}
                >
                    {this._candidateSpots().map(spot =>
                        <Card
                            onSwipeRight={() => this._swipeRight(spot.id)} key={spot.id}
                            onSwipeLeft={() => console.log('not going')}
                        >
                            <div className="buddy" style={{display: 'block'}}>
                                <div className='swipe-spot' style={{
                                    display: 'block',
                                    backgroundImage: `url(${spot.photo_url})`
                                }} />
                                <p className='title'>{spot.title}</p>
                            </div>
                        </Card>
                    )}
                </Cards>
            </div>
        )
    }

    render() {
        return (
            <div>
                <div className='title-section'>
                    <h1 className='one'>
                        <span>立ち寄りたいスポットを決めましょう</span>
                    </h1>
                    <p>ライドの過程で通れるおすすめスポットです。ルート作成に反映されますのでスワイプしてみてください。</p>
                </div>

                <div className='spots-section'>
                    <div className='swipe-photos-section'>
                        {this._renderSpot()}
                        {this._renderNoSpots()}
                    </div>
                    <div className='swipe-indicator-section'>
                        <div className='tooltip-section'>
                            <img src={iconNotGoing} />
                            <img src={iconGoing} />
                            <span className='tooltiptext'>画像を左右にスワイプしてみてください</span>
                        </div>
                    </div>
                </div>

                <div className='cta-section'>
                    <a onClick={() => this.props.onSubmit()}>
                        <span>スポット登録を完了してルートを作成する</span>
                    </a>
                </div>
                <_ProgressBar position={3} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        destinationId: state.destinationId,
        spots: state.spots && state.spots.filter(spot =>
            spot.id !== state.destinationId
        ),
        selectedSpots: state.selectedSpots || []
    }
}

export default connect(mapStateToProps)(Spot)
