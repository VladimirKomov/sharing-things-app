import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import ProfileSettings from './ProfileSettings';
import ItemsSetting from './ItemsSetting';

const DashboardRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />}>
                <Route path="settings" element={<ProfileSettings />} />
                <Route path="items" element={<ItemsSetting />} />
            </Route>
        </Routes>
    );
};

export default DashboardRoutes;
