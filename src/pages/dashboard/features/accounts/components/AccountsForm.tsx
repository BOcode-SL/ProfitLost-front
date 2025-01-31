import { useState, useEffect, useMemo } from 'react';
import {
    Box, IconButton, Typography, TextField, Paper, Button, Switch, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import type { Account } from '../../../../../types/models/account';

interface AccountsFormProps {
    onClose: () => void;
    onSuccess: (account: Account) => Promise<boolean>;
    onDelete?: (accountId: string) => void;
    account?: Account | null;
}

// Estos son los meses que usamos para el backend (siempre en inglés)
const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function AccountsForm({ onClose, onSuccess, onDelete, account }: AccountsFormProps) {
    const { t } = useTranslation();
    const [accountName, setAccountName] = useState(account?.accountName || '');
    const [backgroundColor, setBackgroundColor] = useState(account?.configuration.backgroundColor || '#c84f03');
    const [textColor, setTextColor] = useState(account?.configuration.color || '#ffffff');
    const [isActive, setIsActive] = useState(account?.configuration.isActive ?? true);
    const [monthlyValues, setMonthlyValues] = useState<{ [key: string]: number }>({});
    const [savingChanges, setSavingChanges] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

    const availableYears = useMemo(() => {
        const years = new Set<number>();
        const currentYear = new Date().getFullYear();
        years.add(currentYear);

        if (account) {
            account.records.forEach(record => years.add(record.year));
        }

        return Array.from(years).sort((a, b) => b - a);
    }, [account]);

    useEffect(() => {
        if (account) {
            const values: { [key: string]: number } = {};
            months.forEach(month => {
                const record = account.records.find(r =>
                    r.year === selectedYear && r.month === month
                );
                values[month] = record?.value || 0;
            });
            setMonthlyValues(values);
        }
    }, [account, selectedYear]);

    // Función para obtener el nombre traducido del mes
    const getMonthName = (monthKey: string, short: boolean = false) => {
        const path = short ? 'dashboard.common.monthNamesShort.' : 'dashboard.common.monthNames.';
        return t(path + monthKey);
    };

    const handleSubmit = async () => {
        if (!accountName.trim()) {
            toast.error(t('dashboard.accounts.errors.nameRequired'));
            return;
        }

        setSavingChanges(true);
        try {
            const records = months.map(month => ({
                year: selectedYear,
                month,
                value: monthlyValues[month] || 0
            }));

            if (account) {
                const updatedAccount: Account = {
                    ...account,
                    accountName: accountName.trim(),
                    configuration: {
                        backgroundColor,
                        color: textColor,
                        isActive
                    },
                    records: [
                        ...account.records.filter(r => r.year !== selectedYear),
                        ...records
                    ]
                };
                const success = await onSuccess(updatedAccount);
                if (success) {
                    onClose();
                }
            } else {
                const newAccount: Account = {
                    _id: '',
                    user_id: '',
                    accountName: accountName.trim(),
                    configuration: {
                        backgroundColor,
                        color: textColor,
                        isActive
                    },
                    records,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                const success = await onSuccess(newAccount);
                if (success) {
                    onClose();
                }
            }
        } catch (error) {
            console.error('❌ Error saving changes:', error);
            toast.error(t('dashboard.accounts.errors.savingError'));
        } finally {
            setSavingChanges(false);
        }
    };

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
                                    value={selectedYear}
                                    label={t('dashboard.common.year')}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                >
                                    {availableYears.map(year => (
                                        <MenuItem key={year} value={year}>
                                            {year}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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