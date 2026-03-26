import './App.css'
import Dashboard from './pages/Dashboard';
import { Routes, Route, Link } from 'react-router';
import HomePage from './pages/HomePage';
import DashboardHome from './pages/DashboardHome';
import Componentes from './pages/Componentes';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        
        <Route path='/dashboard' element={<Dashboard />} >
          <Route path='' element={<DashboardHome />} />
          <Route path='comps' element={<Componentes />} />
        </Route>
        
      </Routes>
    </>
  )
}

export default App
