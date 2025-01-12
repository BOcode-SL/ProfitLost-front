import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { toast } from 'react-hot-toast';
import { Switch } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material/Select';

import { accountService } from '../../../../../services/account.service';
import { Account } from '../../../../../types/models/account.modelTypes';

interface AccountsFormProps {
    onClose: () => void;
    onSuccess: () => void;
    account?: Account | null;
}

// Definir un tipo para los meses
type MonthKey = 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 
                'July' | 'August' | 'September' | 'October' | 'November' | 'December';

export default function AccountsForm({ onClose, onSuccess, account }: AccountsFormProps) {
    const [accountName, setAccountName] = useState(account?.accountName || '');
    const [backgroundColor, setBackgroundColor] = useState(account?.configuration.backgroundColor || '#7e2a10');
    const [fontColor, setFontColor] = useState(account?.configuration.color || '#ffffff');
    const [isActive, setIsActive] = useState(account?.configuration.isActive !== false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [monthlyValues, setMonthlyValues] = useState<{ [key: string]: number }>({});
    const [saving, setSaving] = useState(false);
    const [customYear, setCustomYear] = useState('');
    const [showCustomYearInput, setShowCustomYearInput] = useState(false);
    const [uniqueYears, setUniqueYears] = useState<number[]>([]);

    const months = [
        'January', 'February', 'March', 'April', 
        'May', 'June', 'July', 'August', 
        'September', 'October', 'November', 'December'
    ] as const;

    const monthsMap: Record<MonthKey, string> = {
        'January': 'Jan',
        'February': 'Feb',
        'March': 'Mar',
        'April': 'Apr',
        'May': 'May',
        'June': 'Jun',
        'July': 'Jul',
        'August': 'Aug',
        'September': 'Sep',
        'October': 'Oct',
        'November': 'Nov',
        'December': 'Dec'
    };

    useEffect(() => {
        if (account) {
            console.log('Account Data:', account);
            // Solo obtener años que tengan registros con valores
            const years = new Set(
                account.records
                    .filter(record => record.value !== 0)
                    .map(record => record.year)
            );
            const sortedYears = Array.from(years).sort((a, b) => b - a); // Ordenar descendente
            console.log('Available Years:', sortedYears);
            setUniqueYears(sortedYears);
            
            if (sortedYears.length > 0) {
                setSelectedYear(sortedYears[0]); // Seleccionar el año más reciente
            }

            const initialValues: { [key: string]: number } = {};
            account.records.forEach(record => {
                const key = `${record.year}-${record.month}`;
                initialValues[key] = record.value;
                console.log(`Record for ${key}:`, record.value);
            });

            setMonthlyValues(initialValues);
            console.log('Initial Monthly Values:', initialValues);
        }
    }, [account]);

    const handleMonthValueChange = (month: MonthKey, value: number) => {
        const shortMonth = monthsMap[month];
        const key = `${selectedYear}-${shortMonth}`;
        console.log(`Updating value for ${key} to:`, value);
        
        setMonthlyValues(prev => {
            const newValues = { ...prev };
            newValues[key] = value;
            console.log('New monthly values:', newValues);
            return newValues;
        });
    };

    const handleAddCustomYear = () => {
        const yearNumber = parseInt(customYear);

        if (yearNumber >= 1900 && yearNumber <= 2100) {
            if (!uniqueYears.includes(yearNumber)) {
                if (account) {
                    const updatedYears = [...uniqueYears, yearNumber].sort((a, b) => a - b);
                    setUniqueYears(updatedYears);

                    const newValues = { ...monthlyValues };
                    months.forEach(month => {
                        const key = `${yearNumber}-${month}`;
                        newValues[key] = 0;
                    });
                    setMonthlyValues(newValues);

                    setSelectedYear(yearNumber);
                    setShowCustomYearInput(false);
                    setCustomYear('');

                    toast.success('Year added successfully');
                }
            } else {
                toast.error('Year already exists');
            }
        } else {
            toast.error('Invalid year');
        }
    };

    const handleSubmit = async () => {
        if (!accountName.trim()) {
            toast.error('Account name is required');
            return;
        }

        setSaving(true);
        try {
            console.log('Current monthly values:', monthlyValues);

            // Filtrar registros duplicados y asegurar formato correcto
            const recordsMap = new Map();
            Object.entries(monthlyValues).forEach(([key, value]) => {
                const [year, month] = key.split('-');
                const recordKey = `${year}-${month}`;
                recordsMap.set(recordKey, {
                    year: parseInt(year),
                    month: month.substring(0, 3),
                    value: Number(value)
                });
            });

            const records = Array.from(recordsMap.values());
            console.log('Prepared records:', records);

            const accountData = {
                accountName: accountName.trim(),
                configuration: {
                    backgroundColor,
                    color: fontColor,
                    isActive,
                },
                records
            };

            console.log('Sending account data:', accountData);

            const response = account
                ? await accountService.updateAccount(account._id, accountData)
                : await accountService.createAccount(accountData);

            if (response.success) {
                toast.success(account ? 'Account updated successfully' : 'Account created successfully');
                onSuccess();
                onClose();
            } else {
                console.error('Error response:', response);
                toast.error(response.message || `Failed to ${account ? 'update' : 'create'} account`);
            }
        } catch (error) {
            console.error(`Error ${account ? 'updating' : 'creating'} account:`, error);
            toast.error(`Failed to ${account ? 'update' : 'create'} account`);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!account) return;

        const dialog = window.confirm('¿Estás seguro de que quieres eliminar esta cuenta?');
        if (dialog) {
            setSaving(true);
            try {
                const response = await accountService.deleteAccount(account._id);

                if (response.success) {
                    toast.success('Account deleted successfully');
                    onSuccess();
                    onClose();
                } else {
                    toast.error(response.message || 'Failed to delete account');
                }
            } catch (error) {
                console.error('Error deleting account:', error);
                toast.error('Failed to delete account');
            } finally {
                setSaving(false);
            }
        }
    };

    const handleYearChange = (e: SelectChangeEvent<number | 'add_year'>) => {
        const value = e.target.value;
        if (value === 'add_year') {
            setShowCustomYearInput(true);
        } else {
            setShowCustomYearInput(false);
            setSelectedYear(Number(value));
            console.log('Selected Year Changed to:', value);
            console.log('Monthly Values for year:', Object.entries(monthlyValues)
                .filter(([key]) => key.startsWith(`${value}-`))
                .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}));
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={onClose} sx={{ mr: 2 }}>
                    <span className="material-symbols-rounded">close</span>
                </IconButton>
                <Typography variant="h6">
                    {account ? 'Edit Account' : 'Add New Account'}
                </Typography>
            </Box>

            <Box component="form" onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
                <Paper
                    elevation={2}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 1,
                        borderRadius: 3,
                        mb: 2
                    }}
                >
                    <TextField
                        label="Account Name"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        fullWidth
                        size="small"
                    />
                </Paper>

                {account && (
                    <>
                        <Paper
                            elevation={2}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                p: 1,
                                gap: 2,
                                mt: 2,
                                borderRadius: 3
                            }}
                        >
                            <FormControl fullWidth size="small">
                                <InputLabel>Year</InputLabel>
                                <Select
                                    value={showCustomYearInput ? 'add_year' : selectedYear}
                                    onChange={handleYearChange}
                                    label="Year"
                                >
                                    {uniqueYears.map((year) => (
                                        <MenuItem key={year} value={year}>
                                            {year}
                                        </MenuItem>
                                    ))}
                                    <MenuItem value="add_year">Add New Year</MenuItem>
                                </Select>
                            </FormControl>
                        </Paper>

                        {showCustomYearInput && (
                            <Paper elevation={2} sx={{ p: 1, mt: 2, borderRadius: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <TextField
                                        label="Custom Year"
                                        type="number"
                                        value={customYear}
                                        onChange={(e) => setCustomYear(e.target.value)}
                                        size="small"
                                        fullWidth
                                        sx={{ flex: 2 }}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleAddCustomYear}
                                        size="small"
                                        sx={{ height: '35px' }}
                                    >
                                        <span className="material-symbols-rounded">add</span>
                                    </Button>
                                </Box>
                            </Paper>
                        )}

                        {!showCustomYearInput && (
                            <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 3 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {months.map((month) => {
                                        const shortMonth = monthsMap[month];
                                        const key = `${selectedYear}-${shortMonth}`;
                                        const value = monthlyValues[key] || 0;
                                        console.log(`Rendering input for ${key} with value:`, value);

                                        return (
                                            <Box
                                                key={month}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    gap: 2
                                                }}
                                            >
                                                <Typography sx={{ width: 100 }}>{month}</Typography>
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={value}
                                                    onChange={(e) => {
                                                        const newValue = Number(e.target.value);
                                                        handleMonthValueChange(month, newValue);
                                                    }}
                                                    inputProps={{
                                                        step: "0.01",
                                                        min: "0"
                                                    }}
                                                    sx={{ width: '150px' }}
                                                />
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Paper>
                        )}
                    </>
                )}

                <Paper
                    elevation={2}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 1,
                        gap: 2,
                        mt: 2,
                        borderRadius: 3
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 1, width: '100%' }}>
                        <Typography variant="body2" sx={{ width: '100px' }}>Background</Typography>
                        <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            style={{ width: '150px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 1, width: '100%' }}>
                        <Typography variant="body2" sx={{ width: '100px' }}>Font</Typography>
                        <input
                            type="color"
                            value={fontColor}
                            onChange={(e) => setFontColor(e.target.value)}
                            style={{ width: '150px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        />
                    </Box>
                </Paper>

                <Paper
                    elevation={2}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        p: 1,
                        gap: 2,
                        mt: 2,
                        borderRadius: 3
                    }}
                >
                    <Typography variant="body2">Active Account</Typography>
                    <Switch
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                    />
                </Paper>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    {account && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleDelete}
                            disabled={saving}
                            sx={{ height: '45px', flex: 1 }}
                        >
                            Delete
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={saving}
                        sx={{ height: '45px', flex: 1 }}
                    >
                        {saving ? <CircularProgress size={24} color="inherit" /> : (account ? 'Update' : 'Create')}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
} 