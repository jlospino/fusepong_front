import axios from 'axios'

// data inicial
const dataInicial = {
    error: null,
    results: [],
    loading: false
}

const baseUrl = 'https://joseospino.thecompanydev.xyz';

// types
const LOADING = 'LOADING'
const GUARDAR_TICKET_EXITO = 'GUARDAR_TICKET_EXITO'
const GUARDAR_TICKET_ERROR = 'GUARDAR_TICKET_ERROR'
const OBTENER_TICKETS_EXITO = 'OBTENER_TICKETS_EXITO'
const OBTENER_TICKETS_ERROR = 'OBTENER_TICKETS_ERROR'
const EDITAR_TICKET_EXITO = 'EDITAR_TICKET_EXITO'
const EDITAR_TICKET_ERROR = 'EDITAR_TICKET_ERROR'

// reducer
export default function projectReducer(state = dataInicial, action) {
    switch (action.type) {
        case LOADING:
            return {...state, loading: true}
        case OBTENER_TICKETS_EXITO:
            return {...dataInicial, results: action.payload, loading: false}
        case OBTENER_TICKETS_ERROR:
            return {...state, error: action.payload, loading: false}
        case GUARDAR_TICKET_EXITO:
            return {...state, loading: false} 
        case EDITAR_TICKET_EXITO:
            const arrayEditado = state.results.map(item => (
                item.id === action.payload.id ?  {...action.payload} : item
            ))
            return {...state, results: arrayEditado , loading: false}
        case EDITAR_TICKET_ERROR:
            return {...state, error: action.payload, loading: false}
        case GUARDAR_TICKET_ERROR:
            return {...state, error: action.payload, loading: false}
        default:
            return {...state}
    }
}

// acciones
export const obtenerTicketsHistoria = (data) => async (dispatch, getState) => {
    dispatch({
        type: LOADING,
    })
    try {
       const res = await axios.get(`${baseUrl}/api/getTickets/${data.history}`, {
        headers: { 
            'Authorization': `Bearer ${data.token}`, 
            'Access-Control-Allow-Origin': '*',
        },
       });
        dispatch({
            type: OBTENER_TICKETS_EXITO,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: OBTENER_TICKETS_ERROR,
            error: error
        })
    }
}

export const crearTicketHistoria = (data) => async (dispatch, getState) => {
    dispatch({
        type: LOADING,
    })

    const config = {
        headers: { Authorization: `Bearer ${data.token}` }
    };
    
    try {
        const res = await axios.post(`${baseUrl}/api/addTicketHistory`, data, config);
        dispatch({
            type: GUARDAR_TICKET_EXITO,
            payload: res.data
        })
        return res.data

    } catch (error) {
        dispatch({
            type: GUARDAR_TICKET_ERROR,
            error: error
        })
    }
}

export const editarTicketHistoria = (data) => async (dispatch, getState) => {
    dispatch({
        type: LOADING,
    })

    const config = {
        headers: { Authorization: `Bearer ${data.token}` }
    };
    
    try {
        const res = await axios.put(`${baseUrl}/api/updateTicket/${data.id}`, data, config);
        dispatch({
            type: EDITAR_TICKET_EXITO,
            payload: res.data
        })

        return res.data

    } catch (error) {
        dispatch({
            type: EDITAR_TICKET_ERROR,
            error: error
        })
    }
}

export const cancelarTicketHistoria = (data) => async (dispatch, getState) => {
    dispatch({
        type: LOADING,
    })

    const config = {
        headers: { Authorization: `Bearer ${data.token}` }
    };
    
    try {
        const res = await axios.put(`${baseUrl}/api/cancelTicket/${data.id}`, data, config);
        dispatch({
            type: EDITAR_TICKET_EXITO,
            payload: res.data
        })

        return res.data

    } catch (error) {
        dispatch({
            type: EDITAR_TICKET_ERROR,
            error: error
        })
    }
}