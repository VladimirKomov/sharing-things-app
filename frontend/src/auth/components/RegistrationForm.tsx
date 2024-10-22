import {useState} from "react";
import styles from "./RegistrationForm.module.css";

const RegistrationForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [passwordMismatch, setPasswordMismatch] = useState(false);

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
            setError('Passwords do not match');
            return;
        } else {
            setError('');
        }
    }


    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    className={styles.input}
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.button} type="submit">Register</button>
        </form>
    );
}

export default RegistrationForm;
