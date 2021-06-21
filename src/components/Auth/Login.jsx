import React from 'react'
import {withRouter} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {registroUsuarioAccion, ingresoUsuarioAccion} from '../../redux/usuarioDucks'
import {obtenerEmpresas} from '../../redux/companyDucks'
import credentials from '../../credentials'

const Login = (props) => {

    const dispatch = useDispatch()

    const loading = useSelector(store => store.usuario.loading)
    const activo = useSelector(store => store.usuario.activo)
    const companys = useSelector(store => store.company.results)

    const [email, setEmail] = React.useState('')
    const [pass, setPass] = React.useState('')
    const [name, setName] = React.useState('')
    const [company, setCompany] = React.useState('')
    const [error, setError] = React.useState(null)
    const [esRegistro, setEsRegistro] = React.useState(false)

    React.useEffect(() => {
        const fetchData = () => {
            dispatch(obtenerEmpresas())
        }
        fetchData()

        if(activo) {
            props.history.push('/home')
        }
        
    }, [activo, props, dispatch])

    const registro = (e) => {
        e.preventDefault()

        const dataForm = {
            email: email,
            name: name,
            company_id: company,
            password: pass
        }

        if(!company.trim()){
            setError('Seleccione la Compañia')
            return
        }

        if(!name.trim()){
            setError('Ingrese Nombre')
            return
        }
        if(!email.trim()){
            setError('Ingrese Email')
            return
        }
        if(!pass.trim()){
            setError('Ingrese Password')
            return
        }
        if(pass.length < 8){
            setError('La contraseña debe contener 8 carácteres o más')
            return
        }
        
        dispatch(registroUsuarioAccion(dataForm))

        setEmail('')
        setPass('')
        setName('')
        setError('')
    }

    const ingreso = async (e) => {
        e.preventDefault()

        const dataForm = {
            username: email,
            password: pass,
            client_id: credentials.client_id,
            client_secret: credentials.client_secret,
            grant_type: credentials.grant_type
        }

        if(!email.trim()){
            setError('Ingrese Email')
            return
        }
        if(!pass.trim()){
            setError('Ingrese Password')
            return
        }
        if(pass.length < 8){
            setError('La contraseña debe contener 8 carácteres o más')
            return
        }
        
        const res = await dispatch(ingresoUsuarioAccion(dataForm))

        if(!res) {
            setError('Datos de acceso incorrectos')
        }

        
    }

    return (
        <div className="mt-5">
            <h3 className="text-center">
                {
                    esRegistro ? 'Registro de usuarios' : 'Login de acceso'
                }
            </h3>
            <hr/>
            <div className="row justify-content-center">
                <div className="col-12 col-sm-8 col-md-6 col-xl-4">
                    <form onSubmit={esRegistro ? registro : ingreso}>
                        {
                            error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )
                        }
                        {
                            esRegistro ?
                            companys ? (
                                <select className="form-control mb-2"
                                    onChange={e => setCompany(e.target.value)}
                                    value={company}
                                >
                                    <option value="null">Seleccionar Compañia</option>
                                    {
                                        companys.map(item => (
                                            <option value={item.id} key={item.id}>{item.name}</option>
                                        ))
                                    }
                                </select>
                                
                            ): ''
                            : ''
                        }
                        {
                            esRegistro ? 

                            <input 
                            type="text" 
                            className="form-control mb-2"
                            placeholder="Ingrese un nombre"
                            onChange={e => setName(e.target.value)}
                            value={name}
                        /> : ''
                        }
                        <input 
                            type="email" 
                            className="form-control mb-2"
                            placeholder="Ingrese un email"
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                        />
                        <input 
                            type="password" 
                            className="form-control mb-2"
                            placeholder="Ingrese un password"
                            onChange={e => setPass(e.target.value)}
                            value={pass}
                        />
                        {

                        }
                        {
                            esRegistro ? (
                            <button 
                                className="btn btn-dark btn-lg btn-block" 
                                type="submit" 
                                disabled={loading}
                            >
                                Registrarse
                            </button>
                            ): (
                                <button 
                                className="btn btn-dark btn-lg btn-block" 
                                type="submit" 
                                disabled={loading}
                            >
                                Acceder
                            </button> 
                            )

                        }
                        
                        <button 
                            className="btn btn-success btn-sm btn-block"
                            onClick={() => setEsRegistro(!esRegistro)}
                            type="button"
                        >
                            {
                                esRegistro ? '¿Ya estas registrado?' : '¿No tienes cuenta?'
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Login)
