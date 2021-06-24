import React, {useEffect} from 'react'
import Moment from 'react-moment';
import 'moment-timezone';
import {NavLink} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {crearHistoriaProyecto, obtenerDetalleProyecto} from '../redux/projectDucks'

const DetalleProyecto = (props) => {

    const dispatch = useDispatch()

    const proyecto = useSelector(store => store.projects.detalle)
    const loading = useSelector(store => store.projects.loading)
    const user = useSelector(store => store.usuario.user)

    const [formHistory, setFormHistory] = React.useState(false)
    const [history, setHistory] = React.useState('')
    const [ticket, setTicket] = React.useState('')
    const [error, setError] = React.useState(false)

    const saveHistory = async (e) => {
        e.preventDefault()
        if(!history.trim()){
            setError('El campo Nombre Historia no puede estar vacío')
            return
        }

        if(!ticket.trim()){
            setError('El campo Ticket no puede estar vacío')
            return
        }

        const data = {
            token: user.access_token,
            project_id: proyecto.id,
            name: history,
            ticket: ticket
        }
        const res = await dispatch(crearHistoriaProyecto(data))

        if(!res) {
            setError('Error al guardar la historia de usuario')
            return
        }
        proyecto.historys.push(res)
        setHistory('')
        setTicket('')
        setFormHistory(false)
    }

    return(
               
        <div className="pt-2">
            {
                proyecto ? (
                    loading ? 
                    <div className="text-center mt-5">
                        {/*<div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>*/}
                        <br/>Cargando...
                    </div> : 
                    <div className="card mt-5">
                        <div className="card-header py-4">
                            <div className="mb-2">
                                <h5 className="card-title mb-0 text-uppercase font-weight-normal">
                                    <strong>{proyecto.name}</strong>
                                </h5>
                                <Moment format="YYYY/MM/DD">
                                    {proyecto.created_at}
                                </Moment> - <span>{user.company.name}</span>
                            </div>
                            
                            <button 
                                className="btn btn-dark"
                                onClick={() => setFormHistory(true)}
                            >
                                Nueva Historia
                            </button>
                            
                        </div>
                        {
                            formHistory ? (
                                <div className="card-header py-4">
                                    <form onSubmit={saveHistory}>
                                        {
                                            error && (
                                                <div className="alert alert-danger">
                                                    {error}
                                                </div>
                                            )
                                        }
                                        <h4 className="text-primary">Nueva hisotia de usuario</h4>
                                        <div className="mb-2">
                                            <label>Nombre Historia</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Escribir historia de usuario" 
                                                onChange={e => setHistory(e.target.value)}
                                                value={history}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label>Ticket</label>
                                            <textarea 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Describa el ticket en asunto" 
                                                onChange={e => setTicket(e.target.value)}
                                                value={ticket}
                                                rows="2"
                                            />
                                            <small className="text-info">El ticket se relacionará por defecto a la historia de usuario</small> <br/>
                                        </div>
                                        <button 
                                            className="btn btn-link text-dark pl-0"
                                            type="button"
                                            onClick={() => [setFormHistory(false), setError('')]}
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            className="btn btn-dark"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            Guardar
                                        </button>
                                    </form>
                                </div>
                                
                            ): (
                                <div className="card-body">
                                    <p>{proyecto.description}</p>
                                    <h4 className="text-primary">Historias de usuarios</h4>
                                    <ul className="list-group list-group-flush">
                                    {
                                        proyecto.historys.length > 0 ? (
                                            proyecto.historys.map(item => (
                                                <li 
                                                    className="list-group-item list-group-item-action" 
                                                    key={item.id} 
                                                >
                                                    {item.name}<br/><small className="text-light-gray">{item.tickets ? '('+item.tickets.length+') Tickets relacionados' : ''} </small>
                                                    <NavLink className="btn btn-outline-dark btn-sm float-right" to={{ 
                                                        pathname: 'history',
                                                        aboutProps:{
                                                            id: item.id
                                                        },
                                                        state: { item, proyecto:proyecto }
                                                    }} exact>Gestionar</NavLink>
                                                </li>
                                            ))
                                        ): 'No se encontró información...'
                                        }
                                    </ul>
                                </div>
                            )
                        }
                        
                    </div>
                    
                ) : (
                    <div className="card mt-5">
                        <div className="card-body text-secondary">
                            Seleccione un proyecto para ver más información
                        </div>
                    </div>
                )
            }
            
        </div>
    )
}

export default DetalleProyecto