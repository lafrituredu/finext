import './App.css'
import { Routes, Route, Navigate } from "react-router-dom"
import Home from './pages/Home'
import Login from './pages/Login'
import Error404 from './pages/Error404'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Overview from './pages/Overview'
import Register from './pages/Register'
import ProtectedRoute from './components/register/ProtectedRoute.tsx'
import Categories from './pages/Categories'
import Recurrent from './pages/Recurrent'
import Taxes from './pages/Taxes'
import Reports from './pages/Reports'
import Goals from './pages/Goals'
import About from './pages/About.tsx'
import Contact from './pages/Contact.tsx'


function App() {
  return (
    <main className='bg-white dark:bg-[#040919] text-black dark:text-[#D8E0F9]'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />



        {/*  RUTAS PROTEGIDAS */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route path="" element={<Overview />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="categories" element={<Categories />} />
          <Route path="recurrent" element={<Recurrent />} />
          <Route path="reports" element={<Reports />} />
          <Route path="goals" element={<Goals />} />
          <Route path="taxes" element={<Taxes />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </main>
  )
}

export default App