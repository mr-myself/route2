import axios from 'axios'
import { authenticityHeaders } from '../helpers'

export const SET_NEXT_STEP = 'SET_NEXT_STEP'
export const SET_DESTINATIONS = 'SET_DESTINATIONS'
export const SET_SPOTS = 'SET_SPOTS'
export const ADD_NEW_STATE = 'ADD_NEW_STATE'
export const SET_SELECTED_SPOT = 'SET_SELECTED_SPOT'
export const SET_CENTER_POSITION = 'SET_CENTER_POSITION'
export const RESET_SELECTED_SPOT = 'RESET_SELECTED_SPOT'

export function setNextStep(state) {
    return {
        type: SET_NEXT_STEP,
        state
    }
}

export function setDestinations(state) {
    return {
        type: SET_DESTINATIONS,
        state
    }
}

export function setSpots(state) {
    return {
        type: SET_SPOTS,
        state
    }
}

export function setSelectedSpot(state) {
    return {
        type: SET_SELECTED_SPOT,
        state
    }
}

export function addNewState(state) {
    return {
        type: ADD_NEW_STATE,
        state
    }
}

export function setCenterPosition(state) {
    return {
        type: SET_CENTER_POSITION,
        state
    }
}

export function resetSelectedSpot(state) {
    return {
        type: RESET_SELECTED_SPOT,
        state
    }
}

export function moveToNextStep(newState, nextStep) {
    return function(dispatch) {
        dispatch(addNewState(newState))
        dispatch(setNextStep(nextStep))
    }
}

export function moveToPreviousStep(previousStep) {
    return function(dispatch) {
        dispatch(setNextStep(previousStep))
    }
}

export function updateSelectedSpot(newState) {
    return function(dispatch) {
        dispatch(resetSelectedSpot(newState))
    }
}

export function fetchDestinations(startPosition, from, to, category) {
    return function(dispatch) {
        return axios.get('/api/planning/destinations', {
            params: {
                startPosition: startPosition,
                from: from,
                to: to,
                category: category
            }
        }).then(function (response) {
            if (response.data.status == 200) {
                dispatch(setDestinations(response.data.destinations))
            }
        }).catch(function (error) {
            console.error(`fetchDestinations: ${error}`)
        })
    }
}

export function fetchSpots(startPosition, destinationId) {
    return function(dispatch) {
        return axios.get('/api/planning/spots', {
            params: {
                startPosition: startPosition,
                destinationId: destinationId
            }
        }).then(function (response) {
            if (response.data.status == 200) {
                dispatch(setSpots(response.data.spots))
            }
        }).catch(function (error) {
            console.error(`fetchSpots: ${error}`)
        })
    }
}

export function calculateCenterPosition(startPosition, destinationId) {
    return function(dispatch) {
        return axios.get('/api/planning/center_position', {
            params: {
                startPosition: startPosition,
                destinationId: destinationId
            }
        }).then(function (response) {
            if (response.data.status == 200) {
                dispatch(setCenterPosition(
                    response.data.center_position
                ))
            }
        }).catch(function (error) {
            console.error(`calculateCenterPosition: ${error}`)
        })
    }
}

export function pickSpotUp(spotId) {
    return function(dispatch) {
        dispatch(setSelectedSpot(spotId))
    }
}

export function completePlanning(state) {
    return function(dispatch) {
        return axios({
            method: 'POST',
            url: '/api/planning',
            headers: authenticityHeaders(),
            data: state
        }).then(function (response) {
            if (response.data.status == 200) {
                location.href = '/planning/' + response.data.key
                return
            }
        }).catch(function (error) {
            console.error(`completePlanning: ${error}`)
        })
    }
}
