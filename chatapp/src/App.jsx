import './index.css'
import Login from './login/login'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from 'react-router-dom';
import Register from './Register/Register';
import Home from './home/Home';
import { VerifyUser } from './utils/VerifyUser';
function App() {
  return (
    <>
      <div className='p-2 w-screen h-screen flex items-center justify-center text-3xl font-bold'>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Register/>}/>
        <Route element={<VerifyUser/>}>
        <Route path='/' element={<Home/>}/>
        </Route>
        </Routes>  
        <ToastContainer/>
       
      </div>
      
    </>
  )
}

export default App
