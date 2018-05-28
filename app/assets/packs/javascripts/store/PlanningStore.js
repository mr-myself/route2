import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import loggerMiddleware from 'redux-logger'
import reducer from '../reducers/PlanningReducer'


export default function configureStore() {
    const initialState = { step: 1 }
    const enhancer = compose(
        applyMiddleware(
            thunkMiddleware, // lets us dispatch() functions
            loggerMiddleware,
        ),
    );
    return createStore(reducer, initialState, enhancer);
}
