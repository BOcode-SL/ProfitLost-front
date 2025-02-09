import { useState, useEffect, useMemo } from 'react';
import {
    Box, IconButton, Typography, TextField, Paper, Button, Switch, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// Types
import type { Account, YearRecord } from '../../../../../types/models/account';

// Interface for the props of the AccountsForm component
interface AccountsFormProps {
    onClose: () => void; // Function to close the form
    onSuccess: (account: Account) => Promise<boolean>; // Function to handle successful account creation or update
    onDelete?: (accountId: string) => void; // Optional function to handle account deletion
    account?: Account | null; // Optional account object
}

// Months array
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// AccountsForm component
export default function AccountsForm({ onClose, onSuccess, onDelete, account }: AccountsFormProps) {
    const { t } = useTranslation();
    
    const [accountName, setAccountName] = useState(account?.accountName || '');
    const [backgroundColor, setBackgroundColor] = useState(account?.configuration.backgroundColor || '#c84f03');
    const [textColor, setTextColor] = useState(account?.configuration.color || '#ffffff');
    const [isActive, setIsActive] = useState(account?.configuration.isActive ?? true);
    const [monthlyValues, setMonthlyValues] = useState<Record<string, number>>({});
    const [savingChanges, setSavingChanges] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [showYearInput, setShowYearInput] = useState(false);
    const [newYear, setNewYear] = useState<string>('');

    // Memoized available years based on account records
    const availableYears = useMemo(() => {
        const years = new Set<number>();
        const currentYear = new Date().getFullYear();
        years.add(currentYear);

        if (account) {
            Object.keys(account.records).forEach(year => years.add(parseInt(year)));
        }

        return Array.from(years).sort((a: number, b: number) => b - a);
    }, [account]);

    // useEffect to get the monthly values for the selected year
    useEffect(() => {
        if (account) {
            const yearRecord = account.records[selectedYear.toString()];
            if (yearRecord) {
                const values: Record<string, number> = {};
                months.forEach(month => {
                    const monthKey = month.toLowerCase();
                    values[month] = yearRecord[monthKey as keyof YearRecord];
                });
                setMonthlyValues(values);
            }
        }
    }, [account, selectedYear]);

    // Function to get the translated month name
    const getMonthName = (monthKey: string, short: boolean = false) => {
        const path = short ? 'dashboard.common.monthNamesShort.' : 'dashboard.common.monthNames.';
        return t(path + monthKey);
    };

    // Function to handle the form submission
    const handleSubmit = async () => {
        if (!accountName.trim()) {
            toast.error(t('dashboard.accounts.errors.nameRequired'));
            return;
        }

        setSavingChanges(true);
        try {
            const yearRecord: YearRecord = {
                jan: monthlyValues["Jan"] || 0,
                feb: monthlyValues["Feb"] || 0,
                mar: monthlyValues["Mar"] || 0,
                apr: monthlyValues["Apr"] || 0,
                may: monthlyValues["May"] || 0,
                jun: monthlyValues["Jun"] || 0,
                jul: monthlyValues["Jul"] || 0,
                aug: monthlyValues["Aug"] || 0,
                sep: monthlyValues["Sep"] || 0,
                oct: monthlyValues["Oct"] || 0,
                nov: monthlyValues["Nov"] || 0,
                dec: monthlyValues["Dec"] || 0
            };

            const records: Record<string, YearRecord> = {
                [selectedYear.toString()]: yearRecord
            };

            if (account) {
                const updatedAccount: Account = {
                    ...account,
                    accountName,
                    records: {
                        ...account.records,
                        [selectedYear.toString()]: yearRecord
                    },
                    configuration: {
                        backgroundColor,
                        color: textColor,
                        isActive
                    }
                };
                await onSuccess(updatedAccount);
            } else {
                const newAccount: Account = {
                    _id: '',
                    user_id: '',
                    accountName,
                    configuration: {
                        backgroundColor,
                        color: textColor,
                        isActive
                    },
                    records,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                await onSuccess(newAccount);
            }
        } catch (error) {
            console.error('❌ Error saving changes:', error);
            toast.error(t('dashboard.accounts.errors.savingError'));
        } finally {
            setSavingChanges(false);
        }
    };

    // Function to handle the delete action
    const handleDelete = async () => {
        if (!account) return;

        setSavingChanges(true);
        try {
            onDelete?.(account._id);
            onClose();
        } catch {
            toast.error(t('dashboard.accounts.errors.deleteError'));
        } finally {
            setSavingChanges(false);
            setDeleteDialog(false);
        }
    };

    // Function to handle the addition of a new year
    const handleAddYear = () => {
        const yearNumber = parseInt(newYear);
        if (isNaN(yearNumber) || yearNumber < 1900 || yearNumber > 9999) {
            toast.error(t('dashboard.accounts.errors.invalidYear'));
            return;
        }

        if (account?.records[yearNumber.toString()]) {
            toast.error(t('dashboard.accounts.errors.yearExists'));
            return;
        }

        const initialYearRecord: YearRecord = {
            jan: 0, feb: 0, mar: 0, apr: 0,
            may: 0, jun: 0, jul: 0, aug: 0,
            sep: 0, oct: 0, nov: 0, dec: 0
        };

        const updatedAccount: Account = {
            ...account!,
            records: {
                ...account!.records,
                [yearNumber.toString()]: initialYearRecord
            }
        };

        onSuccess(updatedAccount).then(() => {
            setShowYearInput(false);
            setNewYear('');
            setSelectedYear(yearNumber);
        });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={onClose} sx={{ mr: 2 }}>
                    <span className="material-symbols-rounded">close</span>
                </IconButton>
                <Typography variant="h6">
                    {account ? t('dashboard.accounts.editAccount') : t('dashboard.accounts.newAccount')}
                </Typography>
            </Box>

            <Box component="form">
                <Paper elevation={2} sx={{ p: 1, borderRadius: 3, mb: 2 }}>
                    <TextField
                        label={t('dashboard.accounts.form.fields.name.label')}
                        fullWidth
                        size="small"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        placeholder={t('dashboard.accounts.form.fields.name.placeholder')}
                    />
                </Paper>

                {account && (
                    <>
                        <Paper elevation={2} sx={{ p: 1, borderRadius: 3, mb: 2 }}>
                            <FormControl size="small" fullWidth>
                                <InputLabel>{t('dashboard.common.year')}</InputLabel>
                                <Select
                                    value={showYearInput ? '' : selectedYear}
                                    label={t('dashboard.common.year')}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === 'add') {
                                            setShowYearInput(true);
                                        } else {
                                            setSelectedYear(Number(value));
                                        }
                                    }}
                                >
                                    {availableYears.map(year => (
                                        <MenuItem key={year} value={year}>
                                            {year}
                                        </MenuItem>
                                    ))}
                                    <MenuItem value="add">
                                        <span className="material-symbols-rounded" style={{ marginRight: '8px' }}>
                                            add
                                        </span>
                                        {t('dashboard.accounts.form.addYear')}
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            {showYearInput && (
                                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={newYear}
                                        onChange={(e) => setNewYear(e.target.value)}
                                        placeholder={t('dashboard.accounts.form.enterYear')}
                                        fullWidth
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleAddYear}
                                        sx={{ minWidth: 'auto', px: 2 }}
                                    >
                                        <span className="material-symbols-rounded">add</span>
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setShowYearInput(false);
                                            setNewYear('');
                                        }}
                                        sx={{ minWidth: 'auto', px: 2 }}
                                    >
                                        <span className="material-symbols-rounded">close</span>
                                    </Button>
                                </Box>
                            )}
                        </Paper>

                        <Paper elevation={2} sx={{ p: 2, borderRadius: 3, mb: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {months.map(month => (
                                    <Box key={month} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography>{getMonthName(month)}</Typography>
                                        <TextField
                                            size="small"
                                            type="number"
                                            value={monthlyValues[month] || 0}
                                            onChange={(e) => setMonthlyValues(prev => ({
                                                ...prev,
                                                [month]: Number(e.target.value)
                                            }))}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Paper>

                        <Paper elevation={2} sx={{ p: 2, borderRadius: 3, mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography>{t('dashboard.accounts.form.fields.active')}</Typography>
                                <Switch
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                />
                            </Box>
                        </Paper>
                    </>
                )}

                <Paper elevation={2} sx={{ display: 'flex', flexDirection: 'column', p: 2, borderRadius: 3, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                        <Typography>{t('dashboard.accounts.form.fields.backgroundColor')}</Typography>
                        <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mt: 2 }}>
                        <Typography>{t('dashboard.accounts.form.fields.textColor')}</Typography>
                        <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                        />
                    </Box>
                </Paper>

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    {account && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setDeleteDialog(true)}
                            sx={{ flex: 1 }}
                        >
                            {t('dashboard.common.delete')}
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={savingChanges}
                        sx={{ flex: 1 }}
                    >
                        {savingChanges ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            account ? t('dashboard.common.update') : t('dashboard.common.create')
                        )}
                    </Button>
                </Box>
            </Box>

            <Dialog
                open={deleteDialog}
                onClose={() => setDeleteDialog(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        width: '90%',
                        maxWidth: '400px'
                    }
                }}
            >
                <DialogTitle sx={{
                    textAlign: 'center',
                    pt: 3,
                    pb: 1
                }}>
                    {t('dashboard.accounts.form.delete.title')}
                </DialogTitle>
                <DialogContent sx={{
                    textAlign: 'center',
                    py: 2
                }}>
                    <Typography>
                        {t('dashboard.accounts.form.delete.message')}{' '}
                        <Typography component="span" fontWeight="bold" color="primary">
                            {accountName}
                        </Typography>
                        ?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {t('dashboard.accounts.form.delete.warning')}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{
                    justifyContent: 'center',
                    gap: 2,
                    p: 3
                }}>
                    <Button
                        variant="outlined"
                        onClick={() => setDeleteDialog(false)}
                        sx={{ width: '120px' }}
                    >
                        {t('dashboard.common.cancel')}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        disabled={savingChanges}
                        sx={{ width: '120px' }}
                    >
                        {savingChanges ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            t('dashboard.common.delete')
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
} 