import './App.css'
import Login from "./auth/components/LoginForm.tsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from "./auth/components/RegistrationForm";
import MainPage from "./main/components/MainPage.tsx";
import '../styles/variables.css'


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegistrationForm />} />
            </Routes>
        </Router>
    )
}

export default App
