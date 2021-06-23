import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Moment from 'react-moment';
import 'moment-timezone';
import 'moment/locale/es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCheck, faEdit } from '@fortawesome/free-solid-svg-icons'
import {
    crearTicketHistoria,
    obtenerTicketsHistoria,
    editarTicketHistoria,
    cancelarTicketHistoria
} from '../redux/ticketDucks'

const times = <FontAwesomeIcon icon={faTimes} />
const check = <FontAwesomeIcon icon={faCheck} />
const edit = <FontAwesomeIcon icon={faEdit} />


const Tickets = (props) => {

    const dispatch = useDispatch()
    
    const user = useSelector(store => store.usuario.user)
    const loading = useSelector(store => store.tickets.loading)
    const tickets = useSelector(store => store.tickets.results)

    const history = props.location.state.item;
    const proyecto = props.location.state.proyecto;

    const [formTicket, setFormTicket] = React.useState(false)
    const [cancelForm, setCancelForm] = React.useState(false)
    const [ticket, setTicket] = React.useState('')
    const [error, setError] = React.useState('')
    const [modoEdicion, setModoEdicion] = React.useState(false)
    const [id, setId] = React.useState('')

    useEffect(() => {
        const fetchData = () => {
            const data = {
                history: history.id,
                token: user.access_token
            }

            dispatch(obtenerTicketsHistoria(data))
        }
        fetchData()
    }, [history, user, dispatch])

    const saveTicket = async(e) => {
        e.preventDefault()
        if(!ticket.trim()){
            setError('El campo Ticket no puede estar vacío')
            return
        }

        const data = {
            token: user.access_token,
            ticket: ticket,
            history_id: history.id
        }

        const res = await dispatch(crearTicketHistoria(data))

        if(!res) {
            setError('Error al guardar el ticket')
            return
        }
        tickets.push(res)
        setTicket('')
    }

    const editarTicket = async(e) => {
        e.preventDefault()
        if(!ticket.trim()){
            setError('El campo Ticket no puede estar vacío')
            return
        }

        const data = {
            token: user.access_token,
            name: ticket,
            id: id
        }

        const res = await dispatch(editarTicketHistoria(data))

        if(!res) {
            setError('Error al editar el ticket')
            return
        }

        setTicket('')
        setModoEdicion(false)
        setFormTicket(false)
        setId('')

    }

    const cancelTicket = async() => {
        console.log("hola mundo")
        const data = {
            token: user.access_token,
            id: id
        }

        const res = await dispatch(cancelarTicketHistoria(data))

        if(!res) {
            setError('Error al editar el ticket')
            return
        }

        setTicket('')
        setId('')
        setCancelForm(false)
    }

    const activarCancelacion = (item) => {
        setCancelForm(true)
        setTicket(item.name)
        setId(item.id)
    }

    const activarEdicion = (item) => {
        setModoEdicion(true)
        setFormTicket(true)
        setTicket(item.name)
        setId(item.id)
    }

    const colorState = (item) => {
        if(item.state === 'activo')
        {
            return 'text-info'
        }
        if(item.state === 'cancelado')
        {
            return 'text-danger'
        }
        if(item.state === 'en proceso')
        {
            return 'text-warning'
        }
        if(item.state === 'finalizado')
        {
            return 'text-success'
        }
    }

    const capitalize = (text) => {
        return text[0].toUpperCase() + text.slice(1);
    }

    return (
        <div>
            <div className="row mt-4 mt-lg-5">
                <div className="col-md-3">
                    <button 
                        type="button"
                        className="btn btn-dark btn-block"
                        onClick={ () => [setFormTicket(true), setModoEdicion(false), setTicket(''), setError('')] }
                    >
                       <big className="h3 mr-2">+</big> 
                       Nuevo Ticket
                    </button>
                    <div className="card mb-4 mt-3">
                        <div className="card-body">
                            <h5 className="card-title text-uppercase"><strong>{ proyecto.name }</strong></h5>
                            <h6 className="card-subtitle mb-2 text-muted">
                                {user.company.name}
                            </h6>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item pl-0">
                                    <p className="mb-0 font-weight-bold">Fecha:</p>
                                    <Moment format="YYYY/MM/DD">
                                        {proyecto.created_at}
                                    </Moment> 
                                </li>
                                <li className="list-group-item pl-0 d-flex justify-content-between align-items-center">
                                    Historias de usuarios
                                    <span className="badge badge-primary badge-pill">{ proyecto.historys.length }</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-9">
                    {
                        formTicket ? (
                            <>
                                <h5>
                                    {
                                        modoEdicion ? 'Editar ticket' : 'Añadir ticket a la historia de usuario'
                                    }
                                </h5>
                                <h4 className="font-weight-bold">{ history.name }</h4>
                                <div className="card mt-4">
                                    <div className="card-header py-4">
                                        <form onSubmit= { modoEdicion ? editarTicket : saveTicket }>
                                            <h4 className="text-primary mb-3">
                                            {
                                                modoEdicion ? 'Editar Ticket' : 'Nuevo Ticket'
                                            }
                                            </h4>
                                            {
                                                error && (
                                                    <div className="alert alert-danger">
                                                        {error}
                                                    </div>
                                                )
                                            }
                                            <div className="mb-2">
                                                <textarea 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="Describir Ticket" 
                                                    onChange={e => setTicket(e.target.value)}
                                                    value={ticket}
                                                />
                                            </div>
                                            <button 
                                                className="btn btn-link text-dark pl-0"
                                                type="button"
                                                onClick={() => [setFormTicket(false), setError('')]}
                                            >
                                                <span>{times} Cancelar</span>
                                            </button>
                                            <button 
                                                className="btn btn-link text-dark pl-0"
                                                type="submit"
                                                disabled={loading}
                                            >
                                                <span className="text-success">{check} Guardar</span>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </>
                        ): (
                            <>
                            <h5>Listado de tickets</h5>
                            <h4 className="font-weight-bold">{ history.name }</h4>
                            <ul className="list-group mt-4 bg-white">
                            {
                                cancelForm ? (
                                    
                                    <div className="card">
                                        <div className="card-header p-4">
                                            {
                                                error && (
                                                    <div className="alert alert-danger">
                                                        {error}
                                                    </div>
                                                )
                                            }
                                            <h4 className="font-weight-bold text-danger">¿Desea cancelar el ticket?</h4>
                                            <h6 className="mt-2 mb-3"> {ticket}</h6>
                                            <button 
                                                className="btn bg-white mr-2"
                                                type="button"
                                                onClick={() => [setCancelForm(false), setError('')]}
                                            >
                                                <span>Cancelar</span>
                                            </button>
                                            <button 
                                                className="btn btn-dark"
                                                type="button"
                                                onClick={() => cancelTicket()}
                                            >
                                                <span>Aceptar</span>
                                            </button>
                                        </div>
                                        
                                    </div>
                                ):(
                                    tickets  && tickets.length > 0 ? (
                                        tickets.map(item => (
                                            <li 
                                                className="list-group-item list-group-item-action" 
                                                key={item.id} 
                                            >
                                                <p className="text-primary mb-0">
                                                    <span 
                                                        className={colorState(item)}
                                                    >
                                                        {capitalize(item.state)}
                                                    </span>,<span className="px-1"></span> 
                                                    <Moment format="LLL">
                                                        {item.created_at}
                                                    </Moment>  
                                                </p>
                                                <span> {item.name}</span>
                                                <br/>
                                                {
                                                    item.state === 'activo' ? 
                                                    <>
                                                    <button 
                                                        className="btn btn-sm mt-1 pl-0 text-dark mr-3 mt-2"
                                                        type="button"
                                                        onClick={() => activarCancelacion(item)}
                                                    >
                                                        <span>{times} Cancelar </span>
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm mt-1 pl-0 text-dark mt-2"
                                                        type="button"
                                                        onClick={() => activarEdicion(item)}
                                                    >
                                                        <span>{edit} Modificar </span>
                                                    </button>
                                                    </>
                                                    : ''
                                                }
                                                
                                            </li>
                                        ))
                                    ): (
                                        <div className="card">
                                            <div className="card-body text-secondary">
                                                No existen tickets para esta historia de usuario
                                            </div>
                                        </div>
                                    )
                                )
                                
                            }
                            </ul>
                            <h6 className="my-4">({ tickets.length }) Tickets en total</h6>
                            </>
                        )
                    }
                    
                </div>
            </div>
            
        </div>
    )
}

export default Tickets
