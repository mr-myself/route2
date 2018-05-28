import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from '../store/PlanningStore'
import PlanningContainer from '../containers/PlanningContainer'
import configureStore from '../store/PlanningStore'


ReactDOM.render(
    <Provider store={configureStore()}>
        <PlanningContainer />
    </Provider>,
    document.getElementById('app')
)
