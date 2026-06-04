import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '#/components/Layout'
import HomePage from '#/routes/HomePage'

export default function App() {
  return (
    <BrowserRouter basename="/gpxview/">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
