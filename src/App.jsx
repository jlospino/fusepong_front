import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import {useSelector} from 'react-redux'

import Login from './components/Auth/Login';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Tickets from './components/Tickets';

function App() {

  const [user, setUser] = React.useState(false)

  const activo = useSelector(store => store.usuario.activo)
  const dataUser = useSelector(store => store.usuario.user)

  React.useEffect(() => {
    const fetchUser = () => {
      if(activo){
        setUser(dataUser)
      }else{
        setUser(null)
      }
    }
    fetchUser()
  }, [dataUser, activo])

  const RutaPrivada = ({component, path, ...rest}) => {
    if(localStorage.getItem('usuario')){
      const usuarioStorage = JSON.parse(localStorage.getItem('usuario'))
      if(usuarioStorage.uid === user.uid){
        return <Route component={component} path={path} {...rest} />
      }else{
        return <Redirect to="/login" {...rest} />
      }
    }else{
      return <Redirect to="/login" {...rest} />
    }
  }
  
  return user !== false ? (
    <div className="">
      <Router>
        <div>
        <Navbar userLoged="false" />
        <div className="container">
          <Switch>
            <RutaPrivada component={Home} path="/" exact></RutaPrivada>
            <Route component={Login} path="/login" exact></Route>
            <RutaPrivada component={Home} path="/home" exact/>
            <RutaPrivada component={Tickets} path="/history" exact/>
          </Switch>
        </div>
      </div>
      </Router>
    </div>
  ): (
    <p>Cargando...</p>
  )
}

export default App;
