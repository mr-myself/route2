import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import StartPosition from '../components/StartPosition'
import Destination from '../components/Destination'
import Spot from '../components/Spot'
import SpotOrder from '../components/SpotOrder'

import * as actions from '../actions/PlanningActionCreators'


class PlanningContainer extends Component {

    nextStep = (newState) => {
        this.props.dispatch(actions.moveToNextStep(
            newState,
            this.props.state.step + 1
        ))
    }

    previousStep = () => {
        this.props.dispatch(actions.moveToPreviousStep(
            this.props.state.step - 1
        ))
    }

    completePlanning = (state) => {
        this.props.dispatch(actions.completePlanning(state))
    }

    fetchDestinations = (from, to, category) => {
        this.props.dispatch(
            actions.fetchDestinations(
                this.props.state.startPosition, from, to, category
            )
        )
    }

    fetchSpots = () => {
        this.props.dispatch(
            actions.fetchSpots(
                this.props.state.startPosition,
                this.props.state.destinationId
            )
        )
    }

    calculateCenterPosition = () => {
        this.props.dispatch(
            actions.calculateCenterPosition(
                this.props.state.startPosition,
                this.props.state.destinationId
            )
        )
    }

    pickSpotUp = (spotId) => {
        this.props.dispatch(actions.pickSpotUp(spotId))
    }

    completePlanning = (distance, elevation, steps) => {
        const state = this.props.state
        this.props.dispatch(
            actions.completePlanning({
                startPosition: state.startPosition,
                startAddress: state.startAddress,
                selectedSpots: state.selectedSpots,
                destinationId: state.destinationId,
                distance: distance,
                elevation: elevation,
                steps: steps
            })
        )
    }

    updateSelectedSpot = (newIds) => {
        this.props.dispatch(
            actions.updateSelectedSpot(newIds)
        )
    }

    render() {
        return (
            <div>
                {this.props.state.step === 1 && <StartPosition onSubmit={this.nextStep} />}
                {this.props.state.step === 2 && <Destination onSubmit={this.nextStep} fetchDestinations={this.fetchDestinations} />}
                {this.props.state.step === 3 && <Spot onSubmit={this.nextStep} pickSpotUp={this.pickSpotUp} fetchSpots={this.fetchSpots} calculateCenterPosition={this.calculateCenterPosition} />}
                {this.props.state.step === 4 && <SpotOrder onSubmit={this.completePlanning} updateSelectedSpot={this.updateSelectedSpot} previousStep={this.previousStep} />}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { state }
}

function mapDispatchToProps(dispatch) {
    return { dispatch }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlanningContainer)
