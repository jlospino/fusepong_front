import axios from 'axios'

// data inicial
const dataInicial = {
    error: null,
    results: [],
}

const baseUrl = 'http://127.0.0.1:8000';

// types
const LOADING = 'LOADING'
const COMPANY_ERROR = 'COMPANY_ERROR'
const COMPANY_EXITO = 'COMPANY_EXITO'

// reducer
export default function companyReducer(state = dataInicial, action) {
    switch (action.type) {
        case COMPANY_EXITO:
            return {...state, error: null, results: action.payload}
        case COMPANY_ERROR:
            return {...state, error: action.payload}
        default:
            return {...state}
    }
}

// acciones
export const obtenerEmpresas = () => async (dispatch, getState) => {
    if(localStorage.getItem('companys')){
        dispatch({
            type: COMPANY_EXITO,
            payload: JSON.parse(localStorage.getItem('companys'))
        })
        return
    }
    try {
       const res = await axios.get(`${baseUrl}/api/companys`);
        dispatch({
            type: COMPANY_EXITO,
            payload: res.data
        })
        localStorage.setItem('companys', JSON.stringify(res.data))
    } catch (error) {
        dispatch({
            type: COMPANY_ERROR,
            error: error
        })
    }
}