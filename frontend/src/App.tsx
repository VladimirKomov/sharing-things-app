import './App.css'
import Login from "./auth/components/Loggin.tsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    )
}

export default App
