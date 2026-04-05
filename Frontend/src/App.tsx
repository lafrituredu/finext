import './App.css'
import { Routes, Route, Navigate } from "react-router-dom"
import Home from './pages/Home'
import Login from './pages/Login'
import Error404 from './pages/Error404'

function App() {
  return (
    <main className='bg-white dark:bg-[#040919]'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* Ruta 404 */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </main>
  )
}

export default App