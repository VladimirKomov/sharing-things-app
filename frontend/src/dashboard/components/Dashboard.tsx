import React from 'react';
import ItemsList from '../../items/components/ItemsList';

const Dashboard: React.FC = () => {
    return (
        <div>
            <h1>Личный кабинет</h1>
            <ItemsList />
        </div>
    );
};

export default Dashboard;
