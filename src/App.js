import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import './App.css';
import { Switch, Route, Link, Redirect } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Cookies from 'universal-cookie';
import { useHistory } from 'react-router-dom'
import { AuthContext } from './providers/auth';
const cookies = new Cookies()

function Navbar()
{
  const { token } = React.useContext(AuthContext)

  return(
    <header className="navbar">
      <Link className="logo" to="/"><h1>ElizaBet</h1></Link>
      <Link to="/register">Cadastro</Link>
      {token ? <Link to="/logout">Sair</Link> : <Link to="/login">Login</Link>}
    </header>
  )
}

function Landing()
{
  return (
    <h1>Bem-Vindo</h1>
  )
}

function Login()
{
  const { setToken, setData } = React.useContext(AuthContext)
  const history = useHistory()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e)
  {
    e.preventDefault()
    
    axios.put("/user/login", {email: email, password: password}, {withCredentials: true}).then((res) => {
      
      if(cookies.get("token"))
      {
        history.push("/dashboard")
        setToken(res.data.result._id)
        setData(res.data.result)
      }
    })
  }

  return (
  <div className="user-form">
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
      <input spellCheck="false" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)}/>
      <input spellCheck="false" type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)}/>
      <input type="submit" value="Login"/>
    </form>
  </div>
  )
}

function Register()
{
  const history = useHistory()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  function handleSubmit(e)
  {
    e.preventDefault()


    if(password!==confirm)
    {
      alert("Senhas não coincidem!")
      return;
    }

    axios.post("/user/register", {username: username, email: email, password: password}).then((res) => {
      if(!res.data.success)
      {
        alert("Erro no cadastro")
      }

      else
      {
        alert("Cadastro realizado com sucesso!")
        history.push("/login")
      }
    })
  }

  return (
  <div className="user-form">
    <h2>Cadastro</h2>
    <form onSubmit={handleSubmit}>
      <input placeholder="Nome de Usuário" onChange={e => setUsername(e.target.value)}/>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)}/>
      <input type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)}/>
      <input type="password" placeholder="Redigite sua senha" onChange={e => setConfirm(e.target.value)}/>
      <input type="submit" value="Finalizar"/>
    </form>
  </div>
  )
}

function Logout()
{
  const { setToken } = React.useContext(AuthContext)

  useEffect(() => {
    cookies.remove("token")
    setToken(undefined)
  })
  return (
    <Redirect to="/login" exact/>
  )
}

function App() {

  const { setToken, setData } = React.useContext(AuthContext)

  useEffect(() => {
    if(cookies.get("token"))
    {
      axios.get("/user/home", {
        withCredentials: true
      }).then((res) => {
        setToken(cookies.get("token"))
        setData(res.data)
      })
    }
  })

  return (
    <div className="App">
      <Navbar/>
      <Switch>
        <Route path="/" exact component={Landing}/>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register}/>
        <Route path="/dashboard" component={Dashboard}/>
        <Route path="/logout" component={Logout}/>
      </Switch>
    </div>
  );
}

export default App;
