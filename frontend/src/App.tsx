import './App.css'
import Login from "./auth/components/LoginForm.tsx";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import RegistrationForm from "./auth/components/RegistrationForm";
import HomePage from "./main/components/HomePage.tsx";
import '../styles/variables.css'
import NavigationPanel from "./main/components/NavigationPanel.tsx";
import React from "react";
import ProtectedRoute from "./auth/components/ProtectedRoute.tsx";
import DashboardRoutes from "./dashboard/components/DashboardRoutes.tsx";
import ItemDetails from "./items/components/ItemDetails.tsx";


const App: React.FC = () => {
    return (
        <Router>
            <NavigationPanel/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<RegistrationForm/>}/>
                <Route element={<ProtectedRoute/>}>
                    <Route path="/dashboard/*" element={<DashboardRoutes/>}/>
                </Route>
                <Route path="/items/:itemId" element={<ItemDetails />} />
                <Route path="/items/categories/:slug" element={<HomePage/>}/>
            </Routes>
        </Router>
    );
};

export default App
