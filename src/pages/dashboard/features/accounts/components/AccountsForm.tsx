/**
 * AccountsForm Component
 * 
 * Provides a comprehensive form interface for creating and editing financial accounts.
 * 
 * Features:
 * - Account name, color, and active status management
 * - Year-based monthly balance data entry
 * - Adding new years to existing accounts
 * - Account deletion with confirmation dialog
 * - Validation and error handling
 * - Optimized data loading with caching
 * 
 * @module AccountsForm
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
import type { Account } from '../../../../../types/supabase/accounts';
import type { YearRecord } from '../../../../../types/supabase/year_records';
import type { UUID } from '../../../../../types/supabase/common';

/**
 * Extended Account interface with year_records relationship
 * 
 * @interface AccountWithYearRecords
 * @extends {Account}
 */
interface AccountWithYearRecords extends Account {
    /** Records of annual financial data for this account */
    year_records?: YearRecord[];
}

/**
 * Props for the AccountsForm component
 * 
 * @interface AccountsFormProps
 */
interface AccountsFormProps {
    /** Function to handle dialog close action */
    onClose: () => void;
    
    /** Function to handle successful form submission with account data */
    onSuccess: (account: AccountWithYearRecords) => Promise<boolean>;
    
    /** Optional function to handle account deletion */
    onDelete?: (accountId: UUID) => void;
    
    /** Optional account data for editing (null/undefined for new account creation) */
    account?: AccountWithYearRecords | null;
}

/** Array of month names in chronological order (for backend data mapping) */
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * AccountsForm Component
 * 
 * Handles both creation and editing of financial accounts with year-based monthly data.
 * 
 * @param {AccountsFormProps} props - Component properties
 * @returns {JSX.Element} Rendered form component
 */
export default function AccountsForm({ onClose, onSuccess, onDelete, account }: AccountsFormProps) {
    const { t } = useTranslation();

    // Form state for account properties
    const [accountName, setAccountName] = useState(account?.name || '');
    const [backgroundColor, setBackgroundColor] = useState(account?.background_color || '#c84f03');
    const [textColor, setTextColor] = useState(account?.text_color || '#ffffff');
    const [isActive, setIsActive] = useState(account?.is_active ?? true);

    // Monthly data entry state
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

    /**
     * Loads available years for the current account
     * Uses caching for optimized performance
     */
    const loadAvailableYears = useCallback(async () => {
        if (!account?.id) return;
        
        setLoadingYears(true);
        try {
            const currentYear = new Date().getFullYear();
            
            // Check for cached years data
            const cacheKey = `account_${account.id}_available_years`;
            const cachedData = sessionStorage.getItem(cacheKey);
            
            if (cachedData) {
                try {
                    const parsedData = JSON.parse(cachedData) as number[];
                    setAvailableYearsData(parsedData);
                    
                    // Set current year if available, otherwise first year
                    if (parsedData.includes(currentYear)) {
                        setSelectedYear(currentYear);
                    } else if (parsedData.length > 0) {
                        setSelectedYear(parsedData[0]);
                    }
                    
                    setLoadingYears(false);
                    return;
                } catch (e) {
                    console.warn('Error parsing cached years data', e);
                }
            }
            
            // Try to use already loaded data from account
            if (account.year_records && account.year_records.length > 0) {
                const years = new Set<number>();
                years.add(currentYear);
                
                account.year_records.forEach(record => {
                    if (record.year) {
                        years.add(record.year);
                    }
                });
                
                const sortedYears = Array.from(years).sort((a, b) => b - a);
                setAvailableYearsData(sortedYears);
                
                // Cache for future use
                try {
                    sessionStorage.setItem(cacheKey, JSON.stringify(sortedYears));
                } catch (e) {
                    console.warn('Failed to cache years data', e);
                }
                
                // Set current year if available, otherwise first year
                if (sortedYears.includes(currentYear)) {
                    setSelectedYear(currentYear);
                } else if (sortedYears.length > 0) {
                    setSelectedYear(sortedYears[0]);
                }
                
                setLoadingYears(false);
                return;
            }
            
            // If no loaded data, fetch from API
            const response = await accountService.getAccountDetailById(account.id);
            if (response.success && response.data) {
                const accountData = response.data as AccountWithYearRecords;
                if (accountData.year_records && accountData.year_records.length > 0) {
                    const years = new Set<number>();
                    years.add(currentYear);
                    
                    accountData.year_records.forEach(record => {
                        if (record.year) {
                            years.add(record.year);
                        }
                    });
                    
                    const sortedYears = Array.from(years).sort((a, b) => b - a);
                    setAvailableYearsData(sortedYears);
                    
                    // Cache for future use
                    try {
                        sessionStorage.setItem(cacheKey, JSON.stringify(sortedYears));
                    } catch (e) {
                        console.warn('Failed to cache years data', e);
                    }
                    
                    // Set current year if available, otherwise first year
                    if (sortedYears.includes(currentYear)) {
                        setSelectedYear(currentYear);
                    } else if (sortedYears.length > 0) {
                        setSelectedYear(sortedYears[0]);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading available years:', error);
            // Fallback to current year
            setSelectedYear(new Date().getFullYear());
        } finally {
            setLoadingYears(false);
        }
    }, [account?.id, account?.year_records]);

    /**
     * Initialize component on mount or when account changes
     */
    useEffect(() => {
        if (account?.id) {
            loadAvailableYears();
        } else {
            // Default to current year for new accounts
            setSelectedYear(new Date().getFullYear());
        }
    }, [account?.id, loadAvailableYears]);

    /**
     * Calculate available years from account data and current year
     * When API data is unavailable, use fallback calculation
     */
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

    /**
     * Load monthly values when account data or selected year changes
     */
    useEffect(() => {
        // Only proceed if we have a valid numeric year and an account
        const numericYear = typeof selectedYear === 'string' && selectedYear !== ''
            ? parseInt(selectedYear)
            : typeof selectedYear === 'number' ? selectedYear : null;
            
        if (numericYear !== null) {
            // Initialize data containers
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
                        // Convert to string and replace decimal point with comma for user input
                        inputs[month] = value !== null ? value.toString().replace('.', ',') : '0';
                    });
                    setMonthlyValues(values);
                    setMonthlyInput(inputs);
                }
            }
            
            // If we don't have the data and this is an existing account, fetch it
            if (!hasExistingData && account?.id) {
                // Set loading state
                setSavingChanges(true);
                
                // Initialize with zeros first to avoid empty form while loading
                months.forEach(month => {
                    values[month] = 0;
                    inputs[month] = '0';
                });
                setMonthlyValues(values);
                setMonthlyInput(inputs);
                
                /**
                 * Load account details from cache or API
                 */
                const loadAccountDetails = async () => {
                    try {
                        // Try to get from session storage first
                        const cacheKey = `account_${account.id}_year_${numericYear}`;
                        const cachedData = sessionStorage.getItem(cacheKey);
                        
                        if (cachedData) {
                            try {
                                const parsedData = JSON.parse(cachedData);
                                if (parsedData.yearRecord) {
                                    const yearRecord = parsedData.yearRecord;
                                    const newValues: Record<string, number> = {};
                                    const newInputs: Record<string, string> = {};
                                    
                                    months.forEach(month => {
                                        const monthKey = month.toLowerCase() as keyof YearRecord;
                                        const value = yearRecord[monthKey] as number | null;
                                        newValues[month] = value !== null ? value : 0;
                                        newInputs[month] = value !== null ? value.toString().replace('.', ',') : '0';
                                    });
                                    
                                    setMonthlyValues(newValues);
                                    setMonthlyInput(newInputs);
                                    setSavingChanges(false);
                                    return;
                                }
                            } catch (e) {
                                // Ignore cache parsing errors and proceed with API call
                                console.warn('Cache parsing error, fetching fresh data', e);
                            }
                        }
                        
                        // No cache or cache error, fetch from API
                        const response = await accountService.getAccountDetailById(account.id, numericYear);
                        if (response.success && response.data) {
                            const responseData = response.data as { yearRecord?: YearRecord };
                            const yearRecord = responseData.yearRecord;
                            
                            // Cache the response for future use
                            try {
                                sessionStorage.setItem(cacheKey, JSON.stringify(responseData));
                            } catch (e) {
                                console.warn('Failed to cache account data', e);
                            }
                            
                            if (yearRecord) {
                                const newValues: Record<string, number> = {};
                                const newInputs: Record<string, string> = {};
                                
                                months.forEach(month => {
                                    const monthKey = month.toLowerCase() as keyof YearRecord;
                                    const value = yearRecord[monthKey] as number | null;
                                    newValues[month] = value !== null ? value : 0;
                                    newInputs[month] = value !== null ? value.toString().replace('.', ',') : '0';
                                });
                                
                                setMonthlyValues(newValues);
                                setMonthlyInput(newInputs);
                            }
                        }
                    } catch (error) {
                        console.error('Error loading account details:', error);
                        // Leave default zeros in place
                    } finally {
                        setSavingChanges(false);
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

    /**
     * Gets translated month names for display
     * 
     * @param {string} monthKey - The month key to translate
     * @param {boolean} short - Whether to use short month names
     * @returns {string} The translated month name
     */
    const getMonthName = (monthKey: string, short: boolean = false) => {
        const path = short ? 'dashboard.common.monthNamesShort.' : 'dashboard.common.monthNames.';
        return t(path + monthKey);
    };

    /**
     * Form submission handler for both create and update operations
     * Validates and transforms form data to the required format
     */
    const handleSubmit = async () => {
        // Validate account name
        if (!accountName.trim()) {
            toast.error(t('dashboard.accounts.errors.nameRequired'));
            return;
        }

        // Ensure valid year value
        const numericYear = typeof selectedYear === 'string' 
            ? parseInt(selectedYear) 
            : selectedYear;
            
        if (isNaN(numericYear)) {
            toast.error(t('dashboard.accounts.errors.invalidYear'));
            return;
        }

        setSavingChanges(true);
        try {
            // Prepare year record from monthly values
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
                // Create new account with placeholder values for required fields
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

    /**
     * Handles account deletion with confirmation
     */
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

    /**
     * Handles adding a new year to an existing account
     * Validates the input and adds an empty year record
     */
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

        // Clear account years cache
        try {
            const accountYearsCacheKey = `account_${account!.id}_available_years`;
            sessionStorage.removeItem(accountYearsCacheKey);
        } catch (e) {
            console.warn('Error clearing account years cache', e);
        }

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
                                        inputProps={{ 
                                            min: 1900, 
                                            max: 9999,
                                            step: 1
                                        }}
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