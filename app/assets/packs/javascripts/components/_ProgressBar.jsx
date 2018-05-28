import React, { Component } from 'react'
import iconRoadbike from 'packs/images/icon-roadbike'

class _ProgressBar extends Component {

    _renderDone = () => {
        let doneElements = []
        for(var i=0; i<(this.props.position-1); i++) {
            doneElements.push(
                <div style={{display: 'inline-block'}} key={i+'done'}>
                    <div className='circle done' />
                    <span className='bar done' />
                </div>
            )
        }
        return doneElements
    }

    _renderNotYet = () => {
        let notYetElements = []
        for(var i=0; i<(5-this.props.position); i++) {
            notYetElements.push(
                <div style={{display: 'inline-block'}} key={i+'notYet'}>
                    <span className='bar' />
                    <div className='circle' />
                </div>
            )
        }
        return notYetElements
    }

    render() {
        return (
            <div className='progress-section'>
                <div className='progress-line'>
                    {this._renderDone()}
                    <img className='roadbike-icon' src={iconRoadbike} />
                    <div className='circle done' />
                    {this._renderNotYet()}
                </div>
            </div>
        )
    }
}

export default _ProgressBar
