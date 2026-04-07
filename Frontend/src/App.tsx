import './App.css'
import { Routes, Route, Navigate } from "react-router-dom"
import Home from './pages/Home'
import Login from './pages/Login'
import Error404 from './pages/Error404'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <main className='bg-white dark:bg-[#040919] text-black dark:text-[#D8E0F9]'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="*" element={<Error404 />} />
        </Route>
        {/* Ruta 404 */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </main>
  )
}

export default App