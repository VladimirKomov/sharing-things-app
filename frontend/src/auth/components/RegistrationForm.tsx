import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../common/store";
import {register} from "../redux/authSlice";
import {useNavigate} from 'react-router-dom';
import {Alert, Box, Button, CircularProgress, Container, TextField, Typography} from '@mui/material';
import MapSelector from "../../map/components/MapSelector.tsx";

const RegistrationForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState<number | undefined>(undefined);
    const [longitude, setLongitude] = useState<number | undefined>(undefined);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [errorForm, setErrorForm] = useState('');
    const {loading, error: errorApi} = useSelector((state: RootState) => state.auth);
    const [isRegistered, setIsRegistered] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Checking for a password match
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordMismatch(password2 !== e.target.value);
    };

    // Checking the password match in the second input field
    const handlePassword2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword2(e.target.value);
        setPasswordMismatch(password !== e.target.value);
    };

    const handleLocationSelect = (lat: number, lng: number, address?: string) => {
        setLatitude(lat);
        setLongitude(lng);
        if (address) {
            setAddress(address);
        }
        console.log(lat, lng);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        // Checking the password match before sending
        if (passwordMismatch) {
            setErrorForm('Passwords do not match');
            return;
        }

        const userData = {
            username,
            email,
            password,
            password2,
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            address,
            latitude,
            longitude
        };

        dispatch(register(userData))
            .unwrap()
            .then(() => {
                setErrorForm('');
                setIsRegistered(true);
            });
    };

    return (
        <Container
            maxWidth="sm"
            sx={{backgroundColor: "var(--background-color)", padding: '10px'}}
        >
            <Container
                maxWidth={false}
                sx={{
                    width: '95%',
                    borderRadius: '8px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                    padding: '10px',
                }}
            >
                {!isRegistered ? (
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Register
                        </Typography>

                        <TextField
                            label="Nickname"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                        />

                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />

                        <TextField
                            label="First Name"
                            fullWidth
                            margin="normal"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Last Name"
                            fullWidth
                            margin="normal"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />

                        <TextField
                            label="Phone Number"
                            fullWidth
                            margin="normal"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />

                        {/* click your place */}
                        <Typography variant="h6" gutterBottom>
                            Select your location on the map
                        </Typography>
                        <MapSelector onLocationSelect={handleLocationSelect}/>

                        <TextField
                            label="Address"
                            fullWidth
                            margin="normal"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />

                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                            autoComplete="new-password"
                        />

                        <TextField
                            label="Confirm Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={password2}
                            onChange={handlePassword2Change}
                            required
                            autoComplete="new-password"
                        />

                        {/* Password mismatch message */}
                        {passwordMismatch && (
                            <Alert severity="error">Passwords do not match</Alert>
                        )}

                        {/* Error messages */}
                        {errorForm && (
                            <Alert severity="error" sx={{mt: 2}}>
                                {errorForm}
                            </Alert>
                        )}
                        {errorApi && (
                            <Alert severity="error" sx={{mt: 2}}>
                                {errorApi}
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{mt: 3, mb: 2}}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24}/> : 'Register'}
                        </Button>
                    </Box>
                ) : (
                    <Box textAlign="center" sx={{mt: 5}}>
                        <Typography variant="h5" component="h2">
                            Registration is successful!
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/login')}
                            sx={{mt: 3}}
                        >
                            Sign in
                        </Button>
                    </Box>
                )}
            </Container>
        </Container>
    );
};

export default RegistrationForm;
