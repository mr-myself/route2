import * as STATE from '../actions/PlanningActionCreators'


export default (state, action) => {
    switch (action.type) {
        case STATE.SET_NEXT_STEP: {
            return {
                ...state,
                step: action.state
            }
        }

        case STATE.SET_DESTINATIONS: {
            return {
                ...state,
                destinations: action.state
            }
        }

        case STATE.SET_SPOTS: {
            return {
                ...state,
                spots: action.state
            }
        }

        case STATE.SET_CENTER_POSITION: {
            return {
                ...state,
                centerPosition: action.state
            }
        }

        case STATE.SET_SELECTED_SPOT: {
            return {
                ...state,
                selectedSpots: [].concat(
                    (state.selectedSpots || []), [action.state]
                )
            }
        }

        case STATE.RESET_SELECTED_SPOT: {
            return {
                ...state,
                selectedSpots: action.state
            }
        }

        case STATE.ADD_NEW_STATE: {
            return Object.assign(state, action.state)
        }

        default: {
            return state
        }
    }
}
