/**
 * AccountsForm Component
 * 
 * Provides a form interface for creating and editing accounts with the following features:
 * - Account name, color, and active status management
 * - Year-based monthly balance data entry
 * - Adding new years to existing accounts
 * - Account deletion with confirmation
 * - Validation and error handling
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Box,
    IconButton,
    Typography,
    TextField,
    Paper,
    Button,
    Switch,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { accountService } from '../../../../../services/account.service';

// Types
import type { Account } from '../../../../../types/supabase/account';
import type { YearRecord } from '../../../../../types/supabase/year_record';
import type { UUID } from '../../../../../types/supabase/common';

// Extended Account interface with year_records relationship
interface AccountWithYearRecords extends Account {
    year_records?: YearRecord[];
}

// Interface for the props of the AccountsForm component
interface AccountsFormProps {
    onClose: () => void; // Function to close the form
    onSuccess: (account: AccountWithYearRecords) => Promise<boolean>; // Function to handle success
    onDelete?: (accountId: UUID) => void; // Optional function to handle account deletion
    account?: AccountWithYearRecords | null; // Optional account object for editing
}

// Months array for data entry in chronological order
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// AccountsForm component for creating and editing accounts
export default function AccountsForm({ onClose, onSuccess, onDelete, account }: AccountsFormProps) {
    const { t } = useTranslation();

    // Form state management for account properties
    const [accountName, setAccountName] = useState(account?.name || '');
    const [backgroundColor, setBackgroundColor] = useState(account?.background_color || '#c84f03');
    const [textColor, setTextColor] = useState(account?.text_color || '#ffffff');
    const [isActive, setIsActive] = useState(account?.is_active ?? true);

    // Monthly data entry state management
    const [monthlyInput, setMonthlyInput] = useState<Record<string, string>>({});
    const [monthlyValues, setMonthlyValues] = useState<Record<string, number>>({});

    // UI state management
    const [savingChanges, setSavingChanges] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedYear, setSelectedYear] = useState<number | string>('');
    const [showYearInput, setShowYearInput] = useState(false);
    const [newYear, setNewYear] = useState<string>('');
    const [loadingYears, setLoadingYears] = useState(false);
    const [availableYearsData, setAvailableYearsData] = useState<number[]>([]);

    // Load available years for this account
    const loadAvailableYears = useCallback(async () => {
        if (!account?.id) return;
        
        setLoadingYears(true);
        try {
            // First try to get details which should include all years
            const response = await accountService.getAccountDetailById(account.id);
            if (response.success && response.data) {
                const accountData = response.data as AccountWithYearRecords;
                if (accountData.year_records && accountData.year_records.length > 0) {
                    const years = new Set<number>();
                    const currentYear = new Date().getFullYear();
                    years.add(currentYear);
                    
                    accountData.year_records.forEach(record => {
                        if (record.year) {
                            years.add(record.year);
                        }
                    });
                    
                    const sortedYears = Array.from(years).sort((a, b) => b - a);
                    setAvailableYearsData(sortedYears);
                    
                    // Set the first year as selected year
                    if (sortedYears.length > 0) {
                        setSelectedYear(sortedYears[0]);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading available years:', error);
        } finally {
            setLoadingYears(false);
        }
    }, [account?.id]);

    // Run once when the account is loaded or changed
    useEffect(() => {
        if (account?.id) {
            loadAvailableYears();
        } else {
            // If creating a new account, default to current year
            setSelectedYear(new Date().getFullYear());
        }
    }, [account?.id, loadAvailableYears]);

    // Calculate available years from account data and current year
    const availableYears = useMemo(() => {
        // If we have loaded available years from the API, use those
        if (availableYearsData.length > 0) {
            return availableYearsData;
        }
        
        // Otherwise use the fallback calculation
        const years = new Set<number>();
        const currentYear = new Date().getFullYear();
        years.add(currentYear);

        if (account?.year_records) {
            account.year_records.forEach(record => years.add(record.year));
        }

        // Sort years in descending order (newest first)
        return Array.from(years).sort((a: number, b: number) => b - a);
    }, [account?.year_records, availableYearsData]);

    // Load monthly values when account data or selected year changes
    useEffect(() => {
        // Only proceed if we have a valid numeric year and an account
        const numericYear = typeof selectedYear === 'string' && selectedYear !== ''
            ? parseInt(selectedYear)
            : typeof selectedYear === 'number' ? selectedYear : null;
            
        if (numericYear !== null) {
            // Initialize with zeros
            const values: Record<string, number> = {};
            const inputs: Record<string, string> = {};
            
            // First check if we already have the data in the provided account
            let hasExistingData = false;
            
            if (account?.year_records) {
                const yearRecord = account.year_records.find(record => record.year === numericYear);
                if (yearRecord) {
                    hasExistingData = true;
                    months.forEach(month => {
                        const monthKey = month.toLowerCase() as keyof YearRecord;
                        const value = yearRecord[monthKey] as number | null;
                        values[month] = value !== null ? value : 0;
                        // Convert to string and replace decimal point with comma for user input (locale handling)
                        inputs[month] = value !== null ? value.toString().replace('.', ',') : '0';
                    });
                    setMonthlyValues(values);
                    setMonthlyInput(inputs);
                }
            }
            
            // If we don't have the data and this is an existing account, fetch it
            if (!hasExistingData && account?.id) {
                const loadAccountDetails = async () => {
                    try {
                        const response = await accountService.getAccountDetailById(account.id, numericYear);
                        if (response.success && response.data) {
                            const responseData = response.data as { yearRecord?: YearRecord };
                            const yearRecord = responseData.yearRecord;
                            
                            if (yearRecord) {
                                months.forEach(month => {
                                    const monthKey = month.toLowerCase() as keyof YearRecord;
                                    const value = yearRecord[monthKey] as number | null;
                                    values[month] = value !== null ? value : 0;
                                    // Convert to string and replace decimal point with comma for user input (locale handling)
                                    inputs[month] = value !== null ? value.toString().replace('.', ',') : '0';
                                });
                                setMonthlyValues(values);
                                setMonthlyInput(inputs);
                            }
                        }
                    } catch (error) {
                        console.error('Error loading account details:', error);
                        // Set default values of zero if there's an error
                        months.forEach(month => {
                            values[month] = 0;
                            inputs[month] = '0';
                        });
                        setMonthlyValues(values);
                        setMonthlyInput(inputs);
                    }
                };
                
                loadAccountDetails();
            } else if (!hasExistingData) {
                // New account or no existing data - initialize with zeros
                months.forEach(month => {
                    values[month] = 0;
                    inputs[month] = '0';
                });
                setMonthlyValues(values);
                setMonthlyInput(inputs);
            }
        }
    }, [account, selectedYear]);

    // Helper function to get translated month names
    const getMonthName = (monthKey: string, short: boolean = false) => {
        const path = short ? 'dashboard.common.monthNamesShort.' : 'dashboard.common.monthNames.';
        return t(path + monthKey);
    };

    // Handle form submission for both create and update operations
    const handleSubmit = async () => {
        // Validate account name
        if (!accountName.trim()) {
            toast.error(t('dashboard.accounts.errors.nameRequired'));
            return;
        }

        // Make sure we have a valid numeric year value
        const numericYear = typeof selectedYear === 'string' 
            ? parseInt(selectedYear) 
            : selectedYear;
            
        if (isNaN(numericYear)) {
            toast.error(t('dashboard.accounts.errors.invalidYear'));
            return;
        }

        setSavingChanges(true);
        try {
            // Prepare year record from monthly values with proper number conversion
            const yearData: Partial<YearRecord> = {
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

            if (account) {
                // Update existing account
                const updatedAccount: AccountWithYearRecords = {
                    ...account,
                    name: accountName,
                    background_color: backgroundColor,
                    text_color: textColor,
                    is_active: isActive,
                    year_records: [...(account.year_records || [])]
                };

                // Update or create year record
                const yearRecordIndex = updatedAccount.year_records?.findIndex(record => 
                    record.year === numericYear
                );
                if (yearRecordIndex !== undefined && yearRecordIndex >= 0) {
                    // Update existing year record
                    updatedAccount.year_records![yearRecordIndex] = {
                        ...updatedAccount.year_records![yearRecordIndex],
                        ...yearData
                    };
                } else if (updatedAccount.year_records) {
                    // Create new year record
                    const newYearRecord: Partial<YearRecord> = {
                        account_id: account.id,
                        year: numericYear,
                        ...yearData
                    };
                    updatedAccount.year_records.push(newYearRecord as YearRecord);
                }

                await onSuccess(updatedAccount);
            } else {
                // Create new account with placeholder values for the TrackingFields
                const newAccount: AccountWithYearRecords = {
                    id: '' as UUID,
                    user_id: '' as UUID,
                    name: accountName,
                    background_color: backgroundColor,
                    text_color: textColor,
                    is_active: isActive,
                    account_order: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    deleted_at: null,
                    created_by: '' as UUID,
                    updated_by: '' as UUID,
                    deleted_by: null,
                    year_records: [{
                        id: '' as UUID,
                        account_id: '' as UUID,
                        year: numericYear,
                        ...yearData,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        deleted_at: null,
                        created_by: '' as UUID,
                        updated_by: '' as UUID,
                        deleted_by: null
                    } as YearRecord]
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

    // Handle account deletion with confirmation
    const handleDelete = async () => {
        if (!account) return;

        setSavingChanges(true);
        try {
            onDelete?.(account.id);
            onClose();
        } catch {
            toast.error(t('dashboard.accounts.errors.deleteError'));
        } finally {
            setSavingChanges(false);
            setDeleteDialog(false);
        }
    };

    // Handle adding a new year to an existing account
    const handleAddYear = () => {
        // Validate year input
        const yearNumber = parseInt(newYear);
        if (isNaN(yearNumber) || yearNumber < 1900 || yearNumber > 9999) {
            toast.error(t('dashboard.accounts.errors.invalidYear'));
            return;
        }

        // Check if year already exists
        if (account?.year_records?.some(record => record.year === yearNumber)) {
            toast.error(t('dashboard.accounts.errors.yearExists'));
            return;
        }

        // Create empty year record with zeros for all months
        const initialYearData: Partial<YearRecord> = {
            account_id: account!.id,
            year: yearNumber,
            jan: 0,
            feb: 0,
            mar: 0,
            apr: 0,
            may: 0,
            jun: 0,
            jul: 0,
            aug: 0,
            sep: 0,
            oct: 0,
            nov: 0,
            dec: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
            created_by: account!.created_by,
            updated_by: account!.updated_by,
            deleted_by: null
        };

        // Update account with new year record
        const updatedAccount: AccountWithYearRecords = {
            ...account!,
            year_records: [...(account!.year_records || []), initialYearData as YearRecord]
        };

        // Save changes and switch to the new year
        onSuccess(updatedAccount).then(() => {
            setShowYearInput(false);
            setNewYear('');
            setSelectedYear(yearNumber);
        });
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header with close button and title */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={onClose} sx={{ mr: 2 }}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6">
                    {account ? t('dashboard.accounts.editAccount') : t('dashboard.accounts.newAccount')}
                </Typography>
            </Box>

            {/* Account form */}
            <Box component="form">
                {/* Account name input field */}
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

                {/* Year selection and monthly data (only for edit mode) */}
                {account && (
                    <>
                        {/* Year selection dropdown with option to add new year */}
                        <Paper elevation={2} sx={{ p: 1, borderRadius: 3, mb: 2 }}>
                            <FormControl size="small" fullWidth>
                                <InputLabel>{t('dashboard.common.year')}</InputLabel>
                                <Select
                                    value={showYearInput ? '' : selectedYear.toString()}
                                    label={t('dashboard.common.year')}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === 'add') {
                                            setShowYearInput(true);
                                        } else if (value !== '') {
                                            setSelectedYear(Number(value));
                                        }
                                    }}
                                    disabled={loadingYears}
                                >
                                    {loadingYears ? (
                                        <MenuItem value="">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CircularProgress size={20} />
                                                <span>{t('dashboard.common.loading')}</span>
                                            </Box>
                                        </MenuItem>
                                    ) : (
                                        availableYears.map(year => (
                                            <MenuItem key={year} value={year.toString()}>
                                                {year}
                                            </MenuItem>
                                        ))
                                    )}
                                    <MenuItem value="add">
                                        <AddIcon sx={{ mr: 1 }} />
                                        {t('dashboard.accounts.form.addYear')}
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            {/* New year input field with add/cancel buttons */}
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
                                        <AddIcon />
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setShowYearInput(false);
                                            setNewYear('');
                                        }}
                                        sx={{ minWidth: 'auto', px: 2 }}
                                    >
                                        <CloseIcon />
                                    </Button>
                                </Box>
                            )}
                        </Paper>

                        {/* Monthly values input fields */}
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 3, mb: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {months.map(month => (
                                    <Box key={month}
                                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography>{getMonthName(month)}</Typography>
                                        <TextField
                                            size="small"
                                            type="text"
                                            slotProps={{
                                                htmlInput: {
                                                    inputMode: 'decimal',
                                                    pattern: '^[0-9]*([.,][0-9]{0,2})?$'
                                                }
                                            }}
                                            value={monthlyInput[month] || ''}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(',', '.');
                                                // Validate input to ensure it's a valid decimal number
                                                if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                                                    setMonthlyInput(prev => ({
                                                        ...prev,
                                                        [month]: value.replace('.', ',')
                                                    }));
                                                }
                                            }}
                                            onBlur={() => {
                                                // Convert comma to decimal point and parse as float on blur
                                                const value = monthlyInput[month]?.replace(',', '.') || '0';
                                                setMonthlyValues(prev => ({
                                                    ...prev,
                                                    [month]: parseFloat(value)
                                                }));
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Paper>

                        {/* Account active status toggle */}
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

                {/* Account color settings */}
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

                {/* Action buttons (delete/save) */}
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

            {/* Confirmation dialog for account deletion */}
            <Dialog
                open={deleteDialog}
                onClose={() => setDeleteDialog(false)}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 3,
                            width: '90%',
                            maxWidth: '400px'
                        }
                    }
                }}
            >
                {/* Dialog title with warning */}
                <DialogTitle sx={{
                    textAlign: 'center',
                    pt: 3,
                    pb: 1
                }}>
                    {t('dashboard.accounts.form.delete.title')}
                </DialogTitle>

                {/* Dialog confirmation message */}
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

                {/* Dialog action buttons */}
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