import React, {useState} from "react";
import styles from "./RegistrationForm.module.css";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store.ts";
import {register} from "../redux/authSlice.ts";
import {useNavigate} from 'react-router-dom';

const RegistrationForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [errorForm, setErrorForm] = useState('');
    const {loading, error: errorApi} = useSelector((state: RootState) => state.auth);
    const [isRegistered, setIsRegistered] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    //checking the password match
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordMismatch(password2 !== e.target.value);
    };
    //checking the password match in the second input
    const handlePassword2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword2(e.target.value);
        setPasswordMismatch(password !== e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //check password before the sending
        if (passwordMismatch) {
            setErrorForm('Passwords do not match');
            return;
        }
        dispatch(register({username, email, firstName, lastName, password, password2}))
            .unwrap()
            .then(() => {
                setErrorForm('');
                setIsRegistered(true); // Устанавливаем, что регистрация успешна
            })
    }


    return (
        <div>
            {!isRegistered ? (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input
                            className={styles.input}
                            type="text"
                            id="name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            className={styles.input}
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="firstName">First name:</label>
                        <input
                            className={styles.input}
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName">Last name:</label>
                        <input
                            className={styles.input}
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            className={styles.input}
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password2">Confirm Password:</label>
                        <input
                            className={styles.input}
                            type="password"
                            id="password2"
                            value={password2}
                            onChange={handlePassword2Change}
                            required
                        />
                    </div>
                    {/* Password mismatch message */}
                    {passwordMismatch && <p className={styles.error}>Passwords do not match</p>}
                    {/* Error message */}
                    {errorApi && <p className={styles.error}>{errorForm}</p>}
                    {errorApi && <p className={styles.error}>{errorApi.message}</p>}
                    <button className={styles.button} type="submit" disabled={loading}>
                        {loading ? 'Loading...' : 'Register'}
                    </button>
                </form>
            ) : (
                <div className={styles.successContainer}>
                    <h2 className={styles.successMessage}>Регистрация успешна!</h2>
                    <button className={styles.successButton}
                            onClick={() => navigate('/')}>
                        Вернуться на главную
                    </button>
                </div>
            )}
        </div>
    );
}

export default RegistrationForm;