/**
 * Created by tangzhibin on 16/2/23.
 */
'use strict';

import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import devTools from 'remote-redux-devtools';
import reducer from '../reducers';

export default function configureStore(initialState) {
    const enhancer = compose(
        applyMiddleware(thunk),
        devTools({hostname: 'localhost', port: 5678})
    );
    return createStore(reducer, initialState, enhancer);
}
