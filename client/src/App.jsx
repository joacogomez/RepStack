import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Historial from './pages/Historial'
import Detalle from './pages/Detalle'
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
      </Routes>
    </>
  )
}

export default App