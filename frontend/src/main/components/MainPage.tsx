import React from "react";
import CategoryFilter from "../../items/components/CategoryFilter.tsx";
import Login from "../../auth/components/LoginForm.tsx";

const MainPage: React.FC = () => {
    return (
        <div>
            <Login/>
            <h1>Main Page</h1>
            <CategoryFilter/>
        </div>
    )
}

export default MainPage;