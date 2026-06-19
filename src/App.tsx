import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '#/components/Layout'
import HomePage from '#/routes/HomePage'
import HowToPage from '#/routes/HowToPage'

export default function App() {
  return (
    <BrowserRouter basename="/gpxview/">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/how-to" element={<HowToPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
