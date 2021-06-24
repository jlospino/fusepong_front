import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {obtenerProyectos, obtenerDetalleProyecto} from '../redux/projectDucks'
import DetalleProyecto from './DetalleProyecto'

const Home = () => {

  const dispatch = useDispatch()

  const projects = useSelector(store => store.projects.results)
  const user = useSelector(store => store.usuario.user)

  React.useEffect(() => {
    const fetchProjects = () => {
      const data = {
        company: user.company.id,
        token: user.access_token
      }
      dispatch(obtenerProyectos(data))
    }
    fetchProjects()
  }, [user, dispatch])

    return (
        <div>
          {
            projects ? (
              <div>
                <div className="row">
                  <div className="col-md-5">
                    <h3 className="font-weight-bold">Proyectos</h3>
                    <ul className="list-group mt-4 bg-white">
                    {
                      
                      projects.map(item => (
                        <Link 
                          className="list-group-item list-group-item-action" 
                          key={item.id} 
                          onClick={() => dispatch(obtenerDetalleProyecto(item.id, user.access_token))}
                        >
                          <span className="text-uppercase">{item.name}</span>
                        </Link>
                      ))
                    }
                  </ul>
                  </div>
                  <div className="col-md-7">
                    <DetalleProyecto />
                  </div>
                </div>
                
              </div>
              
            ): ''
          }
        </div>
    )
}

export default Home