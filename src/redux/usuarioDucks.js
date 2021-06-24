// imports
import axios from 'axios'

// data inicial
const dataInicial = {
    loading: false,
    activo: false,
    error: null
}

const baseUrl = 'http://127.0.0.1:8000';

// types

const LOADING = 'LOADING'
const USUARIO_ERROR = 'USUARIO_ERROR'
const USUARIO_EXITO = 'USUARIO_EXITO'
const USUARIO_REGISTRO_EXITO = 'USUARIO_REGISTRO_EXITO'
const USUARIO_REGISTRO_ERROR = 'USUARIO_REGISTRO_ERROR'
const CERRAR_SESION = 'CERRAR_SESION'

// reducer
export default function usuarioReducer (state = dataInicial, action) {
    switch (action.type) {
        case LOADING:
            return {...state, loading: true}
        case USUARIO_REGISTRO_EXITO:
            return {...state, loading: false, user: action.payload, activo: false}
        case USUARIO_REGISTRO_ERROR:
            return {...dataInicial, error: action.payload.error, loading: false}
        case USUARIO_ERROR:
            return {...state, loading: false, error: action.payload.error }
        case USUARIO_EXITO:
            return {...state, loading: false, user: action.payload, activo: true}
        case CERRAR_SESION:
            return {...state}
        default:
            return {...state}
    }
}

// acciones
export const ingresoUsuarioAccion = (data) => async (dispatch) => {
    dispatch({
        type: LOADING
    })
    try {
        const token = await axios.post(`${baseUrl}/oauth/token`,data);
        if(token.data.access_token){
            const res = await axios.get( `${baseUrl}/api/user`, { 
                headers: { 
                    'Authorization': `Bearer ${token.data.access_token}`, 
                    'Access-Control-Allow-Origin': '*',
                },
                data: data
            })
            dispatch({
                type: USUARIO_EXITO,
                payload: {
                    uid: res.data.id,
                    email: res.data.email,
                    name: res.data.name,
                    access_token: token.data.access_token,
                    company: res.data.company
                }
            })
            localStorage.setItem('usuario', JSON.stringify({
                uid: res.data.id,
                email: res.data.email,
                name: res.data.name,
                company: res.data.company,
                access_token: token.data.access_token
            }))
        }
        
    } catch (error) {
        dispatch({
            type: USUARIO_ERROR,
            payload: {
                error: error
            }
        })
    }
}

export const registroUsuarioAccion = (data) => async (dispatch) => {
    dispatch({
        type: LOADING
    })
    try {
       const res = await axios.post(`${baseUrl}/api/register_user`, data);
        dispatch({
            type: USUARIO_REGISTRO_EXITO,
            payload: {
                uid: res.id,
                email: res.email,
                name: res.name,
                company_id: res.company_id
            }
        })

        return res.data;
    } catch (error) {
        dispatch({
            type: USUARIO_REGISTRO_ERROR,
            payload: {
                error: error
            }
        })
    }
}

export const leerUsuarioActivoAccion = () => (dispatch) => {
    if(localStorage.getItem('usuario')){
        dispatch({
            type: USUARIO_EXITO,
            payload: JSON.parse(localStorage.getItem('usuario'))
        })
    }
}

export const cerrarSesionAccion = (token) => async (dispatch) => {
    await axios.get(`${baseUrl}/api/logout`, { 
        headers: { 
            'Authorization': `Bearer ${token}`, 
            'Access-Control-Allow-Origin': '*',
        }
    });
    localStorage.removeItem('usuario')
    dispatch({
        type: CERRAR_SESION,
    })
}
