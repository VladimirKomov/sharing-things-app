import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from "../../common/store.ts";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {
    fetchUserSettings,
    selectUserSettings,
    selectUserSettingsLoading,
    updateUserSettings,
    UserSettings
} from "../redux/userSettingsSlice";
import {Box, Button, CircularProgress, TextField, Typography} from '@mui/material';
import MapSelector from "../../common/components/MapSelector";

const ProfileSettings = () => {
    const dispatch = useDispatch<AppDispatch>();
    const data = useSelector(selectUserSettings) as UserSettings | null;
    const loading = useSelector(selectUserSettingsLoading);

    // User data form
    const [formData, setFormData] = useState<UserSettings>({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        latitude: null,
        longitude: null,
    });

    // Fetching user settings
    useEffect(() => {
        dispatch(fetchUserSettings());
    }, [dispatch]);

    // Filling the form with fetched data
    useEffect(() => {
        if (data) {
            setFormData(data);
        }
    }, [data]);

    // Handling form input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handling location selection
    const handleLocationSelect = (lat: number, lng: number, address?: string) => {
        setFormData((prevData) => ({
            ...prevData,
            latitude: lat,
            longitude: lng,
            address: address || prevData.address,
        }));
    };

    // Handling form submission
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        dispatch(updateUserSettings(formData));
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            width: '600px',
            margin: '0 auto',
        }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{textAlign: 'center'}}>
                Profile Settings
            </Typography>
            {loading ? (
                <CircularProgress/>
            ) : (
                data && (
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            mt: 2,
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <TextField
                            label="First Name"
                            variant="outlined"
                            name="firstName"
                            value={formData.firstName || ''}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            name="lastName"
                            value={formData.lastName || ''}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Phone Number"
                            variant="outlined"
                            name="phoneNumber"
                            value={formData.phoneNumber || ''}
                            onChange={handleChange}
                            fullWidth
                        />
                        {/* Use Map selector for address and location */}
                        <MapSelector
                            onLocationSelect={handleLocationSelect}
                            initialLat={formData.latitude || undefined}
                            initialLng={formData.longitude || undefined}
                        />
                        <TextField
                            label="Address"
                            variant="outlined"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                            fullWidth
                        />
                        <Button variant="contained" color="primary" type="submit" sx={{alignSelf: 'center'}}>
                            Save changes
                        </Button>
                    </Box>
                )
            )}
        </Box>
    );
};

export default ProfileSettings;
