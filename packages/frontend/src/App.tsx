import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import FormPage from './pages/FormPage'
import SharePage from './pages/SharePage'
import MatchInputPage from './pages/MatchInputPage'
import ResultPage from './pages/ResultPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/share/:linkId" element={<SharePage />} />
        <Route path="/match" element={<MatchInputPage />} />
        <Route path="/result/:matchId" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  )
}
