import React from 'react';
import {Link, Outlet} from 'react-router-dom';

const Dashboard: React.FC = () => {
    return (
        <div>
            <h1>Personal account</h1>
            <Link to="settings">
                <button>Go to Profile Settings</button>
            </Link>
            <Link to="items">
                <button>Go to Items</button>
            </Link>

            <Outlet/>
        </div>
    );
};

export default Dashboard;

