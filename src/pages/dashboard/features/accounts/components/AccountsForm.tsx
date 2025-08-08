/**
 * AccountsForm Module
 * 
 * Comprehensive form interface for creating and editing financial accounts
 * with support for monthly data entry and year-based management.
 * 
 * Features:
 * - Account name, color, and active status configuration
 * - Year-based monthly balance data entry and visualization
 * - Dynamic year selection with ability to add new years
 * - Account deletion with confirmation dialog
 * - Data validation and error handling
 * - Real-time preview of account appearance
 * - Optimized data loading with caching strategies
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
import { X, Plus, Edit, Trash2 } from 'react-feather';
import { accountService } from '../../../../../services/account.service';

// Types
import type { Account } from '../../../../../types/supabase/accounts';
import type { YearRecord } from '../../../../../types/supabase/year_records';
import type { UUID } from '../../../../../types/supabase/common';

/**
 * Extended Account interface with year_records relationship and additional properties
 * Used for managing account data across multiple years
 * 
 * @interface AccountWithYearRecords
 * @extends {Account}
 */
interface AccountWithYearRecords extends Account {
    /** Annual financial records containing monthly data */
    year_records?: YearRecord[];

    /** All available years in the system for year selection */
    available_years?: number[];
}

/**
 * Props interface for the AccountsForm component
 * Defines the required callbacks and optional account data
 * 
 * @interface AccountsFormProps
 */
interface AccountsFormProps {
    /** Function called when form is closed without saving */
    onClose: () => void;

    /** Function called after successful form submission, returns success status */
    onSuccess: (account: AccountWithYearRecords) => Promise<boolean>;

    /** Optional function for handling account deletion */
    onDelete?: (accountId: UUID) => void;

    /** Account data for editing mode (undefined/null for creation mode) */
    account?: AccountWithYearRecords | null;
}

/** Array of month abbreviations used for data mapping and display */
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * AccountsForm Component
 * 
 * Renders a form for creating and editing financial accounts,
 * with support for managing monthly data across multiple years.
 * 
 * @param {AccountsFormProps} props - Component properties
 * @returns {JSX.Element} Rendered account form component
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
    const [availableYearsData, setAvailableYearsData] = useState<number[]>(
        // Initialize directly with provided years if available
        account?.available_years && account.available_years.length > 0
            ? [...account.available_years].sort((a, b) => b - a)
            : []
    );

    /** Years that have been added but not yet saved */
    const [pendingYears, setPendingYears] = useState<number[]>([]);

    /** Counter used to force component re-renders when needed */
    const [forceRefresh, setForceRefresh] = useState(0);

    /**
     * Loads available years for the current account
     * Attempts multiple sources in order of reliability
     */
    const loadAvailableYears = useCallback(async () => {
        if (!account?.id) return;

        setLoadingYears(true);
        try {
            // Strategy 1: Use years provided by parent component
            if (account.available_years && account.available_years.length > 0) {
                const sortedYears = [...account.available_years].sort((a, b) => b - a);
                setAvailableYearsData(sortedYears);

                // Set current year if available, otherwise first year
                const currentYear = new Date().getFullYear();
                if (sortedYears.includes(currentYear)) {
                    setSelectedYear(currentYear);
                } else if (sortedYears.length > 0) {
                    setSelectedYear(sortedYears[0]);
                }

                setLoadingYears(false);
                return;
            }

            // Strategy 2: Get ALL available years from the API
            const yearsResponse = await accountService.getAvailableYears();
            if (yearsResponse.success && yearsResponse.data) {
                const apiYears = yearsResponse.data as unknown as number[];

                if (apiYears && apiYears.length > 0) {
                    const sortedYears = [...apiYears].sort((a, b) => b - a);
                    setAvailableYearsData(sortedYears);

                    const currentYear = new Date().getFullYear();
                    if (sortedYears.includes(currentYear)) {
                        setSelectedYear(currentYear);
                    } else if (sortedYears.length > 0) {
                        setSelectedYear(sortedYears[0]);
                    }

                    setLoadingYears(false);
                    return;
                }
            }

            // Strategy 3: Use account's existing year_records
            if (account.year_records && account.year_records.length > 0) {
                const years = new Set<number>();

                account.year_records.forEach(record => {
                    if (record.year) {
                        years.add(record.year);
                    }
                });

                // Always add current year as a fallback option
                const currentYear = new Date().getFullYear();
                years.add(currentYear);

                const sortedYears = Array.from(years).sort((a, b) => b - a);
                setAvailableYearsData(sortedYears);

                if (sortedYears.includes(currentYear)) {
                    setSelectedYear(currentYear);
                } else if (sortedYears.length > 0) {
                    setSelectedYear(sortedYears[0]);
                }

                setLoadingYears(false);
                return;
            }

            // Strategy 4: Get account detail from API as last resort
            const response = await accountService.getAccountDetailById(account.id);
            if (response.success && response.data) {
                const accountData = response.data as AccountWithYearRecords;
                if (accountData.year_records && accountData.year_records.length > 0) {
                    const years = new Set<number>();

                    accountData.year_records.forEach(record => {
                        if (record.year) {
                            years.add(record.year);
                        }
                    });

                    // Always add current year as a fallback
                    const currentYear = new Date().getFullYear();
                    years.add(currentYear);

                    const sortedYears = Array.from(years).sort((a, b) => b - a);
                    setAvailableYearsData(sortedYears);

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
    }, [account?.id, account?.year_records, account?.available_years]);

    /**
     * Initialize component on mount or when account changes
     * Sets up initial year selection and loads available years
     */
    useEffect(() => {
        // Strategy 1: Use years from parent component
        if (account?.available_years && account.available_years.length > 0) {
            const sortedYears = [...account.available_years].sort((a, b) => b - a);
            const currentYear = new Date().getFullYear();

            if (sortedYears.includes(currentYear)) {
                setSelectedYear(currentYear);
            } else if (sortedYears.length > 0) {
                setSelectedYear(sortedYears[0]);
            }
        }
        // Strategy 2: Load available years if we have an account ID
        else if (account?.id) {
            loadAvailableYears();
        } else {
            // Default to current year for new accounts
            setSelectedYear(new Date().getFullYear());
        }
    }, [account?.id, account?.available_years, loadAvailableYears]);

    /**
     * Calculates available years from multiple sources
     * Combines API data, account data, and pending years
     */
    const availableYears = useMemo(() => {
        // Strategy 1: Years provided by parent component
        if (account?.available_years && account.available_years.length > 0) {
            // Include both available_years and pendingYears
            const allYears = new Set([...account.available_years, ...pendingYears]);
            return Array.from(allYears).sort((a, b) => b - a);
        }

        // Strategy 2: Years loaded from API
        if (availableYearsData.length > 0) {
            // Combine with pending years
            const allYears = new Set([...availableYearsData, ...pendingYears]);
            return Array.from(allYears).sort((a, b) => b - a);
        }

        // Strategy 3: Calculate from account data
        const years = new Set<number>();
        const currentYear = new Date().getFullYear();
        years.add(currentYear);

        if (account?.year_records) {
            account.year_records.forEach(record => years.add(record.year));
        }

        // Add pending years
        pendingYears.forEach(year => years.add(year));

        // Sort newest first
        return Array.from(years).sort((a: number, b: number) => b - a);
    }, [account?.year_records, account?.available_years, availableYearsData, pendingYears]);

    /**
     * Loads monthly values when account data or selected year changes
     * Populates the form with data for the selected year
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
                        // Convert to string with comma decimal separator for input fields
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
                 * Load account details directly from API
                 * Fetches year-specific data for the account
                 */
                const loadAccountDetails = async () => {
                    try {
                        // Fetch from API with year filter
                        const response = await accountService.getAccountDetailById(account.id, numericYear);
                        if (response.success && response.data) {
                            const responseData = response.data as { yearRecord?: YearRecord };
                            const yearRecord = responseData.yearRecord;

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
            }
        }
    }, [account, selectedYear]);

    /**
     * Gets translated month names for display
     * Returns localized month name based on the current language
     * 
     * @param {string} monthKey - Month abbreviation key (e.g., "Jan")
     * @param {boolean} short - Whether to use short month name format
     * @returns {string} Translated month name
     */
    const getMonthName = (monthKey: string, short: boolean = false) => {
        const path = short ? 'dashboard.common.monthNamesShort.' : 'dashboard.common.monthNames.';
        return t(path + monthKey);
    };

    /**
     * Form submission handler
     * Validates form data and calls appropriate create/update functions
     */
    const handleSubmit = useCallback(async () => {
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

                // Update or create year record for the currently selected year
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
                    // Create new year record for the currently selected year
                    const newYearRecord: Partial<YearRecord> = {
                        account_id: account.id,
                        year: numericYear,
                        ...yearData
                    };
                    updatedAccount.year_records.push(newYearRecord as YearRecord);
                }

                // Add pending years to the year_records array
                pendingYears.forEach(year => {
                    // Skip if year already exists in year_records
                    if (updatedAccount.year_records?.some(record => record.year === year)) {
                        return;
                    }

                    // Create empty year record for each pending year
                    const emptyYearRecord: Partial<YearRecord> = {
                        account_id: account.id,
                        year: year,
                        jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
                        jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0
                    };

                    updatedAccount.year_records?.push(emptyYearRecord as YearRecord);
                });

                // Save the account with all updates
                const success = await onSuccess(updatedAccount);
                if (success) {
                    // Clear pending years after successful save
                    setPendingYears([]);

                    // Refresh available years if we added new ones
                    if (pendingYears.length > 0) {
                        try {
                            // Refresh from API to ensure parent component is updated
                            const yearsResponse = await accountService.getAvailableYears();
                            if (yearsResponse.success && yearsResponse.data) {
                                const apiYears = yearsResponse.data as unknown as number[];
                                if (apiYears && apiYears.length > 0) {
                                    setAvailableYearsData([...apiYears].sort((a, b) => b - a));
                                }
                            }
                        } catch (error) {
                            console.error('Error refreshing available years:', error);
                        }
                    }

                    // Force refresh the UI
                    setForceRefresh(prev => prev + 1);
                }
            } else {
                // Create new account with default values for required fields
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
    }, [accountName, selectedYear, monthlyValues, account, backgroundColor, textColor, isActive, pendingYears, onSuccess, t]);

    /**
     * Handles account deletion with confirmation
     * Calls the onDelete callback with account ID
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
     * Validates the year input and adds it to pending years
     */
    const handleAddYear = () => {
        // Validate year input
        const yearNumber = parseInt(newYear);
        if (isNaN(yearNumber) || yearNumber < 1900 || yearNumber > 9999) {
            toast.error(t('dashboard.accounts.errors.invalidYear'));
            return;
        }

        // Check if year already exists in actual records
        if (account?.year_records?.some(record => record.year === yearNumber)) {
            toast.error(t('dashboard.accounts.errors.yearExists'));
            return;
        }

        // Check if year already exists in pending years
        if (pendingYears.includes(yearNumber)) {
            toast.error(t('dashboard.accounts.errors.yearExists'));
            return;
        }

        // Check if year already exists in availableYearsData
        if (availableYearsData.includes(yearNumber)) {
            toast.error(t('dashboard.accounts.errors.yearExists'));
            return;
        }

        // Add year to pending list
        setPendingYears(prev => [...prev, yearNumber]);

        // Update local UI state - add year to dropdown
        setAvailableYearsData(prevYears => {
            const newYears = [...prevYears];
            if (!newYears.includes(yearNumber)) {
                newYears.push(yearNumber);
                newYears.sort((a, b) => b - a);
            }
            return newYears;
        });

        // Select the newly added year
        setSelectedYear(yearNumber);

        // Reset input and hide the form
        setShowYearInput(false);
        setNewYear('');

        // Force refresh to update dropdown
        setForceRefresh(prev => prev + 1);

        // Show notification
        toast.success(t('dashboard.accounts.success.yearAddedPending'));
    };

    /**
     * Refreshes available years when selected year changes
     * Ensures the year selector always has up-to-date options
     */
    useEffect(() => {
        // Only run if we have account id and a valid selected year
        if (account?.id && selectedYear && availableYearsData.length > 0) {
            // If the selected year is not in available years, refresh the years list
            if (typeof selectedYear === 'number' && !availableYearsData.includes(selectedYear)) {
                loadAvailableYears();
            }
        }
    }, [selectedYear, account?.id, availableYearsData, loadAvailableYears]);

    /**
     * Creates action buttons for external use
     */
    const actionButtons = useMemo(() => (
        <Box sx={{ display: 'flex', gap: 2 }}>
            {account && (
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Trash2 size={20} color="currentColor" />}
                    onClick={() => setDeleteDialog(true)}
                    fullWidth
                >
                    {t('dashboard.common.delete')}
                </Button>
            )}
            <Button
                variant="contained"
                startIcon={account ? <Edit size={20} color="currentColor" /> : <Plus size={20} color="currentColor" />}
                onClick={handleSubmit}
                disabled={savingChanges}
                fullWidth
            >
                {savingChanges ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    account ? t('dashboard.common.update') : t('dashboard.common.create')
                )}
            </Button>
        </Box>
    ), [account, savingChanges, t, handleSubmit]);


    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header with close button and title */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={onClose} sx={{ mr: 2 }}>
                    <X size={20} color="currentColor" />
                </IconButton>
                <Typography variant="h6">
                    {account ? t('dashboard.accounts.editAccount') : t('dashboard.accounts.newAccount')}
                </Typography>
            </Box>

            {/* Account form */}
            <Box component="form" sx={{ flex: 1, overflow: 'auto' }}>
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
                            {!showYearInput ? (
                                <FormControl size="small" fullWidth>
                                    <InputLabel>{t('dashboard.common.year')}</InputLabel>
                                    <Select
                                        key={`year-select-${forceRefresh}-${availableYears.length}-${pendingYears.length}`}
                                        value={selectedYear === '' ? '' : selectedYear.toString()}
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
                                            // Map years to menu items with pending indicator
                                            (() => {
                                                return availableYears.map(year => (
                                                    <MenuItem
                                                        key={`year-option-${year}`}
                                                        value={year.toString()}
                                                        sx={pendingYears.includes(year) ? {
                                                            fontStyle: 'italic',
                                                            '&::after': {
                                                                content: '"*"',
                                                                color: 'primary.main',
                                                                ml: 1,
                                                                fontWeight: 'bold'
                                                            }
                                                        } : {}}
                                                    >
                                                        {year}
                                                    </MenuItem>
                                                ));
                                            })()
                                        )}
                                        <MenuItem value="add">
                                            <Plus size={16} color="currentColor" style={{ marginRight: 8 }} />
                                            {t('dashboard.accounts.form.addYear')}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            ) : (
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
                                        size="small"
                                        onClick={handleAddYear}
                                        sx={{ minWidth: 'auto', px: 2 }}
                                    >
                                        <Plus size={16} color="currentColor" />
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                            setShowYearInput(false);
                                            setNewYear('');
                                        }}
                                        sx={{ minWidth: 'auto', px: 2 }}
                                    >
                                        <X size={16} color="currentColor" />
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
                                            inputProps={{
                                                inputMode: 'decimal',
                                                pattern: '^[0-9]*([.,][0-9]{0,2})?$'
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

                {/* Pending years notification */}
                {pendingYears.length > 0 && (
                    <Typography
                        variant="caption"
                        color="primary.main"
                        sx={{
                            mt: 1,
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {pendingYears.length === 1
                            ? t('dashboard.accounts.pendingYear')
                            : t('dashboard.accounts.pendingYears', { count: pendingYears.length })}
                    </Typography>
                )}
            </Box>

            {/* Action buttons at the bottom */}
            <Box sx={{ mt: 2 }}>
                {actionButtons}
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