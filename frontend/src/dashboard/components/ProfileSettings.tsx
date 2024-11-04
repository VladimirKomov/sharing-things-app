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
import styles from './ProfileSettings.module.css';

const ProfileSettings = () => {
    const dispatch = useDispatch<AppDispatch>();
    const data = useSelector(selectUserSettings) as UserSettings | null;
    const loading = useSelector(selectUserSettingsLoading);


    const [formData, setFormData] = useState<UserSettings>({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        latitude: null,
        longitude: null,
    });

    useEffect(() => {
        dispatch(fetchUserSettings());
    }, [dispatch]);

    useEffect(() => {
        if (data) {
            setFormData(data);
        }
    }, [data]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        dispatch(updateUserSettings(formData));
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Profile settings</h2>
            {loading && <p>Loading...</p>}
            {data && (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.label}>
                        First name:
                        <input
                            className={styles.input}
                            type="text"
                            name="firstName"
                            value={formData.firstName || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className={styles.label}>
                        Last name:
                        <input
                            className={styles.input}
                            type="text"
                            name="lastName"
                            value={formData.lastName || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className={styles.label}>
                        Phone number:
                        <input
                            className={styles.input}
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label className={styles.label}>
                        Address:
                        <input
                            className={styles.input}
                            type="text"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <button className={styles.button} type="submit">Submit</button>
                </form>
            )}
        </div>
    );
};

export default ProfileSettings;
