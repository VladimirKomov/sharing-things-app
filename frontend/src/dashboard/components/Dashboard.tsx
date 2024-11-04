import React from 'react';
import {Link} from "react-router-dom";

const Dashboard: React.FC = () => {
    return (
        <div>
            <h1>Личный кабинет</h1>
            <Link to="/dashboard/settings">
                <button>Go to Profile Settings</button>
            </Link>
        </div>
    );
};

export default Dashboard;
