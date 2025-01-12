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

import { accountService } from '../../../../../services/account.service';
import { Account } from '../../../../../types/models/account.modelTypes';

interface AccountsFormProps {
    onClose: () => void;
    onSuccess: () => void;
    account?: Account | null;
}

export default function AccountsForm({ onClose, onSuccess, account }: AccountsFormProps) {
    const [accountName, setAccountName] = useState(account?.accountName || '');
    const [backgroundColor, setBackgroundColor] = useState(account?.configuration.backgroundColor || '#7e2a10');
    const [fontColor, setFontColor] = useState(account?.configuration.color || '#ffffff');
    const [isActive] = useState(account?.configuration.isActive !== false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [monthlyValues, setMonthlyValues] = useState<{ [key: string]: number }>({});
    const [saving, setSaving] = useState(false);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    useEffect(() => {
        if (account) {
            const values: { [key: string]: number } = {};
            account.records.forEach(record => {
                values[`${record.year}-${record.month}`] = record.value;
            });
            setMonthlyValues(values);
        }
    }, [account]);

    const handleMonthValueChange = (month: string, value: number) => {
        setMonthlyValues(prev => ({
            ...prev,
            [`${selectedYear}-${month}`]: value
        }));
    };

    const handleSubmit = async () => {
        if (!accountName.trim()) {
            toast.error('Account name is required');
            return;
        }

        setSaving(true);
        try {
            const accountData = {
                accountName: accountName.trim(),
                configuration: {
                    backgroundColor,
                    color: fontColor,
                    isActive,
                },
                records: account ? Object.entries(monthlyValues).map(([key, value]) => {
                    const [year, month] = key.split('-');
                    return {
                        year: parseInt(year),
                        month,
                        value
                    };
                }) : undefined
            };

            const response = account
                ? await accountService.updateAccount(account._id, accountData)
                : await accountService.createAccount(accountData);

            if (response.success) {
                toast.success(account ? 'Account updated successfully' : 'Account created successfully');
                onSuccess();
                onClose();
            } else {
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
                                    label="Year"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                >
                                    {/* Options for years */}
                                </Select>
                            </FormControl>
                        </Paper>

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
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                {months.map(month => (
                                    <Box
                                        key={month}
                                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                                        <Typography sx={{ width: 100 }}>{month}</Typography>
                                        <TextField
                                            size="small"
                                            type="number"
                                            value={monthlyValues[`${selectedYear}-${month}`] || 0}
                                            onChange={(e) => handleMonthValueChange(month, Number(e.target.value))}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
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