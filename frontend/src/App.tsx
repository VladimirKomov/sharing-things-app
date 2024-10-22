import './App.css'
import Login from "./auth/components/LogginForm";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from "./auth/components/RegistrationForm";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegistrationForm />} />
            </Routes>
        </Router>
    )
}

export default App
