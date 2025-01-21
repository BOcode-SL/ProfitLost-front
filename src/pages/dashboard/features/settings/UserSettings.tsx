import { useState, useRef } from 'react';
import { Box, TextField, Button, Avatar, Paper, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import toast from 'react-hot-toast';

import { useUser } from '../../../../contexts/UserContext';
import { userService } from '../../../../services/user.service';
import type { UserApiErrorResponse } from '../../../../types/api/responses';
import { DateFormat, TimeFormat, Currency, Language } from '../../../../types/models/user';
import './UserSettings.scss';

const dateFormatOptions = [
    { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' as DateFormat },
    { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' as DateFormat }
];

const timeFormatOptions = [
    { label: '12h (AM/PM)', value: '12h' as TimeFormat },
    { label: '24h', value: '24h' as TimeFormat }
];

const currencyOptions = [
    { label: 'USD - US Dollar', value: 'USD' as Currency },
    { label: 'EUR - Euro', value: 'EUR' as Currency },
    { label: 'GBP - British Pound', value: 'GBP' as Currency }
];

const languageOptions = [
    {
        value: 'enUS' as Language,
        label: 'English (US)'
    },
    {
        value: 'esES' as Language,
        label: 'Español (ES)'
    }
];

export default function UserSettings() {
    const { user, loadUserData } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        surname: user?.surname || '',
        language: user?.language || 'enUS' as Language,
        currency: user?.currency || 'USD' as Currency,
        dateFormat: user?.dateFormat || 'DD/MM/YYYY' as DateFormat,
        timeFormat: user?.timeFormat || '12h' as TimeFormat,
        profileImage: null as File | null
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (file: File) => {
        if (file.size > 8 * 1024 * 1024) {
            toast.error('Image size must be less than 8MB');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const response = await userService.updateProfile(formData);
            if (response.success) {
                await loadUserData();
                toast.success('Profile image updated successfully');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error((error as UserApiErrorResponse).message || 'Error uploading image');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteImage = async () => {
        setLoading(true);
        try {
            const response = await userService.deleteProfileImage();
            if (response.success) {
                await loadUserData();
                toast.success('Profile image deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error((error as UserApiErrorResponse).message || 'Error deleting image');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        const updateFormData = new FormData();
        updateFormData.append('name', formData.name);
        updateFormData.append('surname', formData.surname);
        updateFormData.append('language', formData.language);
        updateFormData.append('currency', formData.currency);
        updateFormData.append('dateFormat', formData.dateFormat);
        updateFormData.append('timeFormat', formData.timeFormat);

        try {
            const response = await userService.updateProfile(updateFormData);
            if (response.success) {
                await loadUserData();
                toast.success('Settings updated successfully');
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            toast.error((error as UserApiErrorResponse).message || 'Error updating settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="settings">
            <Box className="settings__details">
                {/* Profile Image Paper */}
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                    <h3>Profile Picture</h3>
                    <Box className="image__section">
                        <Avatar
                            src={formData.profileImage ? URL.createObjectURL(formData.profileImage) : user?.profileImage}
                            alt={user?.name}
                            sx={{ width: 150, height: 150, bgcolor: 'primary.main' }}
                        />
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    handleImageUpload(file);
                                }
                            }}
                            style={{ display: 'none' }}
                        />
                        <Box className="image-buttons">
                            {user?.profileImage ? (
                                <Button
                                    variant="text"
                                    onClick={handleDeleteImage}
                                    disabled={loading}
                                    size="small"
                                >
                                    Delete Image
                                </Button>
                            ) : (
                                <Button
                                    variant="text"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={loading}
                                    size="small"
                                >
                                    Change Image
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Paper>

                {/* Personal Info Paper */}
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                    <h3>Personal Information</h3>
                    <Box className="form-fields">
                        <TextField
                            size="small"
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            size="small"
                            label="Surname"
                            name="surname"
                            value={formData.surname}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </Box>
                </Paper>

                {/* Preferences Paper */}
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                    <h3>Preferences</h3>
                    <Box className="form-fields">
                        <FormControl fullWidth size="small">
                            <InputLabel>Language</InputLabel>
                            <Select<Language>
                                name="language"
                                value={formData.language}
                                label="Language"
                                onChange={handleSelectChange}
                            >
                                {languageOptions.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size="small">
                            <InputLabel>Currency</InputLabel>
                            <Select<Currency>
                                name="currency"
                                value={formData.currency}
                                label="Currency"
                                onChange={handleSelectChange}
                            >
                                {currencyOptions.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size="small">
                            <InputLabel>Date Format</InputLabel>
                            <Select<DateFormat>
                                name="dateFormat"
                                value={formData.dateFormat}
                                label="Date Format"
                                onChange={handleSelectChange}
                            >
                                {dateFormatOptions.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size="small">
                            <InputLabel>Time Format</InputLabel>
                            <Select<TimeFormat>
                                name="timeFormat"
                                value={formData.timeFormat}
                                label="Time Format"
                                onChange={handleSelectChange}
                            >
                                {timeFormatOptions.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Paper>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="submit-button"
                    size="medium"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </Box>
        </Box>
    );
}

