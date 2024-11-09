import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Dashboard from './Dashboard';
import ProfileSettings from './ProfileSettings';
import ItemsSetting from './ItemsSetting';
import OrdersList from "../../orders/conponents/OrdersList.tsx";

const DashboardRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard/>}>
                <Route path="settings" element={<ProfileSettings/>}/>
                <Route path="items" element={<ItemsSetting/>}/>
                <Route path="orders" element={<OrdersList ownerOnly={true} />} />
            </Route>
        </Routes>
    );
};

export default DashboardRoutes;
