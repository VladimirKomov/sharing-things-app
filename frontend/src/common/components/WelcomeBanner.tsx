import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Box } from '@mui/material';
import {selectCurrentUser} from "../../auth/redux/authSlice.ts";
import {CurrentUser} from "../models/auth.model.ts";

interface WelcomeBannerProps {
    currentUser?: { username: string };
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = () => {
    const currentUser: CurrentUser | null = useSelector(selectCurrentUser);

    return (
        <Box sx={{ textAlign: 'center', color: '#fff' }}>
            {currentUser ? (
                <Typography variant="h4" component="h1" sx={{ color: '#fff' }}>
                    Welcome back, {currentUser.username}!
                </Typography>
            ) : (
                <Typography variant="h4" component="h1" sx={{ color: '#fff' }}>
                    Welcome, guest!
                </Typography>
            )}
        </Box>
    );
};

export default WelcomeBanner;
