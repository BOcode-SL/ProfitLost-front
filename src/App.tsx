import { Route, Routes } from "react-router-dom"

import Home from "./pages/landing/Home"
import AuthPage from "./pages/landing/AuthPage"

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/login' element={<AuthPage />}></Route>
      {/*<Route path='/dashboard' element={
          <DashBoard />
      }>
      </Route> */}
    </Routes>
  )
}

export default App
