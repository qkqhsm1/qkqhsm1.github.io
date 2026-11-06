import { Route, Routes } from 'react-router-dom'
import { BatterySim } from '@/pages/BatterySim'
import { Home } from '@/pages/Home'
import { Research } from '@/pages/Research'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/research" element={<Research />} />
      <Route path="/battery-sim" element={<BatterySim />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
