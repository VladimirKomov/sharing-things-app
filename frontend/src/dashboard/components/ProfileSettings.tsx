import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from "../../store";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {
    fetchUserSettings,
    selectUserSettings,
    selectUserSettingsLoading,
    updateUserSettings,
    UserSettings
} from "../redux/userSettingsSlice";

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
        <div>
            <h2>Profile settings</h2>
            {loading && <p>Загрузка...</p>}
            {data && (
                <form onSubmit={handleSubmit}>
                    <label>
                        First name:
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Last name:
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Phone number:
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Address:
                        <input
                            type="text"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
};

export default ProfileSettings;
