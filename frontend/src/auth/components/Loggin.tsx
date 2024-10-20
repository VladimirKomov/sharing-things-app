import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store.ts";
import {useState} from "react";
import {login} from "../redux/authSlice.ts";
import styles from './Login.module.css';

const Login: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {loading, error} = useSelector((state: RootState) => state.auth);
    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
       dispatch(login({usernameOrEmail, password}));
    }

    return (
        <form className={styles.form} onSubmit={handleLogin}>
            <div>
                <input
                    className={styles.input}
                    type="text"
                    value={usernameOrEmail}
                    placeholder="username or Email"
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <input
                    className={styles.input}
                    type="password"
                    value={password}
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button className={styles.button} type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Login'}
            </button>
            {error && <p className={styles.error}>{error.message}</p>}
        </form>
    );
}

export default Login;