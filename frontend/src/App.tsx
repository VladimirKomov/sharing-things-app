import './App.css'
import Login from "./auth/components/LoginForm.tsx";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import RegistrationForm from "./auth/components/RegistrationForm";
import HomePage from "./main/components/HomePage.tsx";
import '../styles/variables.css'
import Dashboard from "./dashboard/components/Dashboard.tsx";
import NavigationPanel from "./main/components/NavigationPanel.tsx";
import React from "react";
import ProfileSettings from "./dashboard/components/ProfileSettings.tsx";
import ProtectedRoute from "./auth/components/ProtectedRoute.tsx";


const App: React.FC = () => {
    return (
        <Router>
            <NavigationPanel/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<RegistrationForm/>}/>
                <Route element={<ProtectedRoute/>}>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/dashboard/settings" element={<ProfileSettings/>}/>
                </Route>
                <Route path="/items/categories/:slug" element={<HomePage/>}/>
            </Routes>
        </Router>
    );
};

export default App
