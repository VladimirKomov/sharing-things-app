import './App.css'
import Login from "./auth/components/LoginForm.tsx";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import RegistrationForm from "./auth/components/RegistrationForm";
import '../styles/variables.css'
import NavigationPanel from "./common/components/NavigationPanel.tsx";
import React from "react";
import ProtectedRoute from "./auth/components/ProtectedRoute.tsx";
import DashboardRoutes from "./dashboard/components/DashboardRoutes.tsx";
import ItemDetails from "./items/components/ItemDetails.tsx";
import OrdersManager from "./orders/conponents/OrdersManager.tsx";
import ItemsList from "./items/components/ItemsList.tsx";
import styles from './App.module.css'


const App: React.FC = () => {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <NavigationPanel />
            <div className={styles.containerApp}>
                <Routes>
                    <Route path="/" element={<ItemsList />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<RegistrationForm />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard/*" element={<DashboardRoutes />} />
                        <Route path="/orders" element={<OrdersManager />} />
                    </Route>
                    <Route path="/items/:itemId" element={<ItemDetails />} />
                    <Route path="/items/categories/:slug" element={<ItemsList />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App
