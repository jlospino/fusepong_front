import React from 'react'
import {Link, NavLink, withRouter} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {cerrarSesionAccion} from '../redux/usuarioDucks'
import Logo from './../logo.png'

const Navbar = (props) => {

    const dispatch = useDispatch()
    const activo = useSelector(store => store.usuario.activo)
    const user = useSelector(store => store.usuario.user)

    
    const cerrarSesion = (token) => {
        dispatch(cerrarSesionAccion(token))
        props.history.push('/login')
    }

    return (
        <div className="navbar navbar-dark bg-dark mb-4 shadow">
            <div className="container">
                <Link className="navbar-brand" to="/">
                <img src={Logo} alt="" className="logo" />
                </Link>
                <div>
                    <div className="d-flex">
                    {
                        activo ? (
                            <>
                                <NavLink className="btn btn-dark mr-2" to="/home" exact>Inicio</NavLink>
                                <button 
                                    onClick={() => cerrarSesion(user.access_token)} 
                                    className="btn btn-dark mr-2"
                                >
                                    Cerrar Sesión
                                </button>
                            </>
                        ): (
                            <NavLink className="btn btn-dark mr-2" to="/login" exact>Ingresar</NavLink>
                        )
                    }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Navbar)
