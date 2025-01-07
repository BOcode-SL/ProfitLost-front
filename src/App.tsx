import { Route, Routes } from "react-router-dom"
import Home from "./pages/landing/Home"

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />}></Route>
      {/* <Route path='/login' element={<Login />}></Route>
      <Route path='/register' element={<Register />}></Route>
      <Route path='/dashboard' element={
          <DashBoard />
      }>
      </Route> */}
    </Routes>
  )
}

export default App
