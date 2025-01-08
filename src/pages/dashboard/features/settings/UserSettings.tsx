import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { useUser } from '../../../../contexts/UserContext';
import './UserSettings.scss';
import { DateFormat, TimeFormat, Currency } from '../../../../types/models/user.types';

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

export default function UserSettings() {
    const { user } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        surname: user?.surname || '',
        currency: user?.currency || 'USD',
        dateFormat: user?.dateFormat || 'DD/MM/YYYY' as DateFormat,
        timeFormat: user?.timeFormat || '12h' as TimeFormat,
        profileImage: null as File | null
    });

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
                                if (file) setFormData(prev => ({ ...prev, profileImage: file }));
                            }}
                            style={{ display: 'none' }}
                        />
                        <Box className="image-buttons">
                            {user?.profileImage
                                ? <Button
                                    variant="text"
                                    onClick={() => {/* handle delete */ }}
                                    size="small"
                                >
                                    Delete Image
                                </Button>
                                : <Button
                                    variant="text"
                                    onClick={() => {/* handle change */ }}
                                    size="small"
                                >
                                    Change Image
                                </Button>
                            }
                        </Box>
                    </Box>
                </Paper>

                {/* Personal Info Paper */}
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                    <h3>Personal Information</h3>
                    <Box className="form-fields">
                        <TextField
                            label="Name"
                            value={formData.name}
                            onChange={() => {/* handle change */ }}
                            fullWidth
                        />
                        <TextField
                            label="Surname"
                            value={formData.surname}
                            onChange={() => {/* handle change */ }}
                            fullWidth
                        />
                    </Box>
                </Paper>

                {/* Preferences Paper */}
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                    <h3>Preferences</h3>
                    <Box className="form-fields">
                        <FormControl fullWidth>
                            <InputLabel>Currency</InputLabel>
                            <Select
                                value={formData.currency}
                                label="Currency"
                                onChange={() => {/* handle change */ }}
                            >
                                {currencyOptions.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Date Format</InputLabel>
                            <Select
                                value={formData.dateFormat}
                                label="Date Format"
                                onChange={() => {/* handle change */ }}
                            >
                                {dateFormatOptions.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Time Format</InputLabel>
                            <Select
                                value={formData.timeFormat}
                                label="Time Format"
                                onChange={() => {/* handle change */ }}
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
                    onClick={() => {/* handle submit */ }}
                    className="submit-button"
                    sx={{ width: '100%' }}
                >
                    Save Changes
                </Button>
            </Box>
        </Box>
    );
}

