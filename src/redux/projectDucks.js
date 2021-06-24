import axios from 'axios'

// data inicial
const dataInicial = {
    error: null,
    results: [],
    loading: false
}

const baseUrl = 'http://127.0.0.1:8000';

// types
const LOADING = 'LOADING'
const OBTENER_PROYECTOS_ERROR = 'OBTENER_PROYECTOS_ERROR'
const OBTENER_PROYECTOS_EXITO = 'OBTENER_PROYECTOS_EXITO'
const DETALLE_PROYECTO_EXITO = 'DETALLE_PROYECTO_EXITO'
const DETALLE_PROYECTO_ERROR = 'DETALLE_PROYECTO_ERROR'
const GUARDAR_HISTORIA_EXITO = 'GUARDAR_HISTORIA_EXITO'
const GUARDAR_HISTORIA_ERROR = 'GUARDAR_HISTORIA_ERROR'

// reducer
export default function projectReducer(state = dataInicial, action) {
    switch (action.type) {
        case LOADING:
            return {...state, loading: true}
        case OBTENER_PROYECTOS_EXITO:
            return {...state, error: null, results: action.payload, loading: false}
        case DETALLE_PROYECTO_EXITO:
            return {...state, error: null, ...action.payload, loading: false}
        case DETALLE_PROYECTO_ERROR:
            return {...state, error: action.payload, loading: false}
        case OBTENER_PROYECTOS_ERROR:
            return {...state, error: action.payload, loading: false}
        case GUARDAR_HISTORIA_EXITO:
            return {...state, error: null, ...action.payload, loading: false}
        case GUARDAR_HISTORIA_ERROR:
            return {...state, error: action.payload, loading: false}
        default:
            return {...state}
    }
}

// acciones
export const obtenerProyectos = (data) => async (dispatch, getState) => {
    dispatch({
        type: LOADING,
    })
    /*if(localStorage.getItem('projects'+data.company)){
        dispatch({
            type: OBTENER_PROYECTOS_EXITO,
            payload: JSON.parse(localStorage.getItem('projects'+data.company))
        })
        return
    }*/
    try {
       const res = await axios.get(`${baseUrl}/api/projects/${data.company}`, {
        headers: { 
            'Authorization': `Bearer ${data.token}`, 
            'Access-Control-Allow-Origin': '*',
        },
       });
        dispatch({
            type: OBTENER_PROYECTOS_EXITO,
            payload: res.data
        })
        // localStorage.setItem('projects'+data.company, JSON.stringify(res.data))
    } catch (error) {
        dispatch({
            type: OBTENER_PROYECTOS_ERROR,
            error: error
        })
    }
}

export const obtenerDetalleProyecto = (id, token) => async (dispatch, getState) => {
    dispatch({
        type: LOADING,
    })
    /*if(localStorage.getItem('project'+id)){
        dispatch({
            type: DETALLE_PROYECTO_EXITO,
            payload: JSON.parse(localStorage.getItem('project'+id))
        })
        return
    }*/
    try {
        const res = await axios.get(`${baseUrl}/api/project/${id}`, {
            headers: { 
                'Authorization': `Bearer ${token}`, 
                'Access-Control-Allow-Origin': '*',
            }
        });
        dispatch({
            type: DETALLE_PROYECTO_EXITO,
            payload: {
                detalle: res.data
            }
        })

        return res.data
        // localStorage.setItem('project'+id, JSON.stringify(res.data))
    } catch (error) {
        dispatch({
            type: DETALLE_PROYECTO_ERROR,
            payload:{
                error: error
            }
        })
    }
}

export const crearHistoriaProyecto = (data) => async (dispatch, getState) => {
    dispatch({
        type: LOADING,
    })

    const config = {
        headers: { Authorization: `Bearer ${data.token}` }
    };
    
    try {
        const res = await axios.post(`${baseUrl}/api/addHistory`, data, config);
        dispatch({
            type: GUARDAR_HISTORIA_EXITO,
            payload: res.data
        })
        return res.data
    } catch (error) {
        dispatch({
            type: GUARDAR_HISTORIA_ERROR,
            error: error
        })
    }
}