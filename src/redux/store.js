import {createStore, combineReducers, compose, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import usuarioReducer, {leerUsuarioActivoAccion} from './usuarioDucks'
import companyReducer from './companyDucks'
import projectReducer from './projectDucks'
import ticketReducer from './ticketDucks'

const rootReducer = combineReducers({
    usuario: usuarioReducer,
    company: companyReducer,
    projects: projectReducer,
    tickets: ticketReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function generateStore(){
    const store = createStore( rootReducer, composeEnhancers( applyMiddleware(thunk) ) )
    leerUsuarioActivoAccion()(store.dispatch)
    return store;
}