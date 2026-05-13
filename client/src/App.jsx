import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Historial from './pages/Historial'
import Detalle from './pages/Detalle'
import Admin from './pages/Admin'
import ParticlesBackground from './components/ParticlesBackground'

function App() {
  return (
    <>
      <ParticlesBackground />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/historial/:fecha" element={<Detalle />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}

export default App