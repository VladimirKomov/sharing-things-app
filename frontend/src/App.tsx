import './App.css'
import Login from "./auth/components/LoginForm.tsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from "./auth/components/RegistrationForm";
import MainPage from "./main/components/MainPage.tsx";
import '../styles/variables.css'
import Dashboard from "./dashboard/components/Dashboard.tsx";
import NavigationPanel from "./main/components/NavigationPanel.tsx";



const App: React.FC = () => {
    return (
        <Router>
            <NavigationPanel />
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
};

export default App
