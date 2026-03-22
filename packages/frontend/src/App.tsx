import { BrowserRouter, Routes, Route } from 'react-router-dom'

function HomePage() {
  return (
    <div>
      <h1>영원한 서약 매칭</h1>
      <p>FF14 파트너 매칭 서비스</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}
