import React from "react";
import { Route, Routes } from "react-router-dom"

import Home from "./pages/landing/Home"
import AuthPage from "./pages/landing/AuthPage"
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'));


function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/login' element={<AuthPage />}></Route>
      <Route path='/dashboard' element={<Dashboard />}>
      </Route>
    </Routes>
  )
}

export default App
