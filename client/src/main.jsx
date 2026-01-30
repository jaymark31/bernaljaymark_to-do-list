import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import ListItem from './pages/list-item.jsx'
import Login from './login.jsx'
import './css/globals.css'


import {
  BrowserRouter,
  Routes,
  Route } from "react-router-dom";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
  <Routes>
    <Route path="/" element={ <App />} />
    <Route path="/login" element={ <Login />} />
    <Route path="/Home" element={ <Home />} />
    <Route path="/Register" element={ <Register />} />
    <Route path="/ListItem" element={ <ListItem />} />
    
   
    
    
  </Routes>
  </BrowserRouter>
  </StrictMode>,
)
