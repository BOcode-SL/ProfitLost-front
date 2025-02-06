import { useState, useRef } from 'react';
import { Box, TextField, Button, Avatar, Paper, FormControl, InputLabel, Select, MenuItem, Typography, SelectChangeEvent } from '@mui/material';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { useUser } from '../../../../contexts/UserContext';
import { userService } from '../../../../services/user.service';
import type { UserApiErrorResponse } from '../../../../types/api/responses';
import { DateFormat, TimeFormat, Currency, Language } from '../../../../types/models/user';

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

interface UserSettingsProps {
    onSuccess?: () => void;
}

export default function UserSettings({ onSuccess }: UserSettingsProps) {
    const { t } = useTranslation();
    const { user, loadUserData } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        surname: user?.surname || '',
        language: user?.preferences?.language || 'enUS',
        currency: user?.preferences?.currency || 'USD',
        dateFormat: user?.preferences?.dateFormat || 'DD/MM/YYYY',
        timeFormat: user?.preferences?.timeFormat || '12h',
        theme: user?.preferences?.theme || 'light',
        viewMode: user?.preferences?.viewMode || 'fullYear',
        profileImage: null as File | null,
        previewUrl: user?.profileImage || '',
        deleteImage: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'name' && !value.trim()) {
            return;
        }
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

    const handleImageUpload = (file: File) => {
        if (file.size > 8 * 1024 * 1024) {
            toast.error(t('dashboard.settings.userSettings.profileImageError'));
            return;
        }

        setFormData(prev => ({
            ...prev,
            profileImage: file,
            previewUrl: URL.createObjectURL(file),
            deleteImage: false
        }));
    };

    const handleDeleteImage = () => {
        if (formData.previewUrl && formData.previewUrl !== user?.profileImage) {
            URL.revokeObjectURL(formData.previewUrl);
        }
        setFormData(prev => ({
            ...prev,
            profileImage: null,
            previewUrl: '',
            deleteImage: true
        }));
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            toast.error(t('dashboard.settings.userSettings.nameRequired'));
            return;
        }

        setLoading(true);
        const updateFormData = new FormData();
        
        updateFormData.append('name', formData.name.trim());
        updateFormData.append('surname', formData.surname);
        updateFormData.append('language', formData.language);
        updateFormData.append('currency', formData.currency);
        updateFormData.append('dateFormat', formData.dateFormat);
        updateFormData.append('timeFormat', formData.timeFormat);

        if (formData.deleteImage) {
            updateFormData.append('deleteImage', 'true');
        }
        else if (formData.profileImage) {
            updateFormData.append('profileImage', formData.profileImage);
        }

        try {
            const response = await userService.updateProfile(updateFormData);
            if (response.success) {
                if (formData.previewUrl && formData.previewUrl !== user?.profileImage) {
                    URL.revokeObjectURL(formData.previewUrl);
                }
                await loadUserData();
                toast.success(t('dashboard.common.success.saved'));
                onSuccess?.();
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            toast.error((error as UserApiErrorResponse).message || t('dashboard.settings.userSettings.settingsUpdatedError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3
            }}>
                {/* Profile Image Paper */}
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            mt: 0,
                            mb: 2
                        }}
                    >
                        {t('dashboard.settings.userSettings.profileImage')}
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <Avatar
                            src={formData.deleteImage ? undefined : (formData.previewUrl || user?.profileImage)}
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
                        <Box sx={{
                            display: 'flex',
                            gap: 1
                        }}>
                            {(user?.profileImage || formData.profileImage) && !formData.deleteImage ? (
                                <Button
                                    variant="text"
                                    onClick={handleDeleteImage}
                                    disabled={loading}
                                    size="small"
                                >
                                    {t('dashboard.settings.userSettings.deleteImage')}
                                </Button>
                            ) : (
                                <Button
                                    variant="text"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={loading}
                                    size="small"
                                >
                                    {t('dashboard.settings.userSettings.changeImage')}
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Paper>

                {/* Personal Info Paper */}
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            mt: 0,
                            mb: 2
                        }}
                    >
                        {t('dashboard.settings.userSettings.personalInformation')}
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        width: '100%'
                    }}>
                        <TextField
                            size="small"
                            label={t('dashboard.settings.userSettings.name')}
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            size="small"
                            label={t('dashboard.settings.userSettings.surname')}
                            name="surname"
                            value={formData.surname}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </Box>
                </Paper>

                {/* Preferences Paper */}
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            mt: 0,
                            mb: 2
                        }}
                    >
                        {t('dashboard.settings.userSettings.preferences')}
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        width: '100%'
                    }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>{t('dashboard.settings.userSettings.language')}</InputLabel>
                            <Select<Language>
                                name="language"
                                value={formData.language}
                                label={t('dashboard.settings.userSettings.language')}
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
                            <InputLabel>{t('dashboard.settings.userSettings.currency')}</InputLabel>
                            <Select<Currency>
                                name="currency"
                                value={formData.currency}
                                label={t('dashboard.settings.userSettings.currency')}
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
                            <InputLabel>{t('dashboard.settings.userSettings.dateFormat')}</InputLabel>
                            <Select<DateFormat>
                                name="dateFormat"
                                value={formData.dateFormat}
                                label={t('dashboard.settings.userSettings.dateFormat')}
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
                            <InputLabel>{t('dashboard.settings.userSettings.timeFormat')}</InputLabel>
                            <Select<TimeFormat>
                                name="timeFormat"
                                value={formData.timeFormat}
                                label={t('dashboard.settings.userSettings.timeFormat')}
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
                    fullWidth
                    size="medium"
                >
                    {loading ? t('dashboard.settings.userSettings.saving') : t('dashboard.settings.userSettings.saveChanges')}
                </Button>
            </Box>
        </Box>
    );
}

