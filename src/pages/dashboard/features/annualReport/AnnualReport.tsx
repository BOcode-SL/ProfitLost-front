/**
 * AnnualReport Component
 * 
 * Main component for the Annual Report feature, providing year-based financial insights.
 * Features include:
 * - Year selection with data-driven available years
 * - View mode toggle (Year-to-date vs Full Year)
 * - Monthly transaction breakdown via charts
 * - Income, expense, and balance summaries
 * - Category-based transaction analysis
 * - User preference persistence across sessions
 */
import { useState, useEffect } from 'react';
import { Box, Paper, FormControl, Select, MenuItem, InputLabel, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// Contexts
import { useUser } from '../../../../contexts/UserContext';

// Services
import { transactionService } from '../../../../services/transaction.service';
import { userService } from '../../../../services/user.service';

// Types
import type { Transaction } from '../../../../types/supabase/transactions';
import type { TransactionApiErrorResponse } from '../../../../types/api/responses';

// Utils
import { fromSupabaseTimestamp } from '../../../../utils/dateUtils';
import { TRANSACTION_UPDATED_EVENT } from '../../../../utils/events';

// Components
import AnnualChart from './components/AnnualChart';
import AnnualCategories from './components/AnnualCategories';
import AnnualBalances from './components/AnnualBalances';

// AnnualReport component
export default function AnnualReport() {
    const { t } = useTranslation();
    const { user, loadUserData } = useUser();

    const currentYear = new Date().getFullYear().toString();
    const [year, setYear] = useState(currentYear);
    const [yearsWithData, setYearsWithData] = useState<string[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'yearToday' | 'fullYear'>(user?.preferences.viewMode || 'fullYear');
    const [isUpdatingViewMode, setIsUpdatingViewMode] = useState(false);

    // Initialize view mode from user preferences
    useEffect(() => {
        if (user?.preferences.viewMode) {
            setViewMode(user.preferences.viewMode);
        }
    }, [user?.preferences.viewMode]);

    // Fetch all transaction years to populate the year selector
    useEffect(() => {
        const fetchTransactionYears = async () => {
            try {
                const response = await transactionService.getTransactionYears();
                if (response.success && Array.isArray(response.data)) {
                    // If no years with data, add current year to prevent Select validation error
                    if (response.data.length === 0) {
                        setYearsWithData([currentYear]);
                    } else {
                        setYearsWithData(response.data);
                    }
                }
            } catch (error: unknown) {
                const transactionError = error as TransactionApiErrorResponse;
                switch (transactionError.error) {
                    case 'UNAUTHORIZED':
                        toast.error(t('dashboard.common.error.UNAUTHORIZED'));
                        break;
                    case 'CONNECTION_ERROR':
                        toast.error(t('dashboard.common.error.CONNECTION_ERROR'));
                        break;
                    case 'DATABASE_ERROR':
                        toast.error(t('dashboard.common.error.DATABASE_ERROR'));
                        break;
                    case 'SERVER_ERROR':
                        toast.error(t('dashboard.common.error.SERVER_ERROR'));
                        break;
                    default:
                        toast.error(t('dashboard.common.error.loading'));
                }
                // Set current year as fallback when error occurs
                setYearsWithData([currentYear]);
            }
        };

        fetchTransactionYears();
    }, [t, currentYear]);

    // Fetch transactions for the selected year
    useEffect(() => {
        const fetchTransactionsByYear = async () => {
            setIsLoading(true);
            try {
                const response = await transactionService.getTransactionsByYear(Number(year));
                if (response.success && Array.isArray(response.data)) {
                    setTransactions(response.data);
                }
            } catch (error: unknown) {
                const transactionError = error as TransactionApiErrorResponse;
                switch (transactionError.error) {
                    case 'INVALID_DATE_FORMAT':
                        toast.error(t('dashboard.common.error.INVALID_DATE_FORMAT'));
                        break;
                    case 'UNAUTHORIZED':
                        toast.error(t('dashboard.common.error.UNAUTHORIZED'));
                        break;
                    case 'CONNECTION_ERROR':
                        toast.error(t('dashboard.common.error.CONNECTION_ERROR'));
                        break;
                    case 'DATABASE_ERROR':
                        toast.error(t('dashboard.common.error.DATABASE_ERROR'));
                        break;
                    case 'SERVER_ERROR':
                        toast.error(t('dashboard.common.error.SERVER_ERROR'));
                        break;
                    default:
                        toast.error(t('dashboard.common.error.loading'));
                }
                setTransactions([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactionsByYear();
    }, [year, t]);

    // Listen for transaction update events and refresh data
    useEffect(() => {
        const handleTransactionUpdated = async () => {
            setIsLoading(true);
            try {
                const response = await transactionService.getTransactionsByYear(Number(year));
                if (response.success && Array.isArray(response.data)) {
                    setTransactions(response.data);
                }
            } catch (error) {
                console.error('Error refreshing transactions:', error);
            } finally {
                setIsLoading(false);
            }
        };

        window.addEventListener(TRANSACTION_UPDATED_EVENT, handleTransactionUpdated);
        
        return () => {
            window.removeEventListener(TRANSACTION_UPDATED_EVENT, handleTransactionUpdated);
        };
    }, [year]);

    // Apply the selected view mode filter to transactions
    const filteredTransactions = transactions.filter(transaction => {
        if (viewMode === 'yearToday') {
            // For year-to-date mode, only include transactions up to today
            const today = new Date();
            const transactionDate = fromSupabaseTimestamp(transaction.transaction_date);
            return transactionDate <= today;
        }
        // For full year mode, include all transactions
        return true;
    });

    // Update user preference when view mode is changed
    const handleViewModeChange = async (newMode: 'yearToday' | 'fullYear') => {
        if (newMode === viewMode) return;

        setIsUpdatingViewMode(true);
        try {
            const response = await userService.updateViewMode(newMode);
            if (response.success && response.data) {
                setViewMode(newMode);
                loadUserData();
            }
        } catch {
            toast.error(t('dashboard.common.error.updating'));
        } finally {
            setIsUpdatingViewMode(false);
        }
    };

    // Main container for the annual report
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
        }}>
            {/* Year and view mode selection controls */}
            <Paper elevation={3} sx={{ p: 1, borderRadius: 3, width: '100%' }}>
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' }
                }}>
                    {/* Year dropdown selector */}
                    <FormControl size="small"
                        sx={{
                            flexGrow: 1,
                            minWidth: { xs: '100%', sm: 200 },
                        }}>
                        <InputLabel>{t('dashboard.common.year')}</InputLabel>
                        <Select
                            value={yearsWithData.includes(year) ? year : yearsWithData[0] || ''}
                            label={t('dashboard.common.year')}
                            onChange={(e) => setYear(e.target.value)}
                        >
                            {yearsWithData.map((yearOption) => (
                                <MenuItem key={yearOption} value={yearOption}>
                                    {yearOption}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* View mode toggle (only shown for current year) */}
                    {year === currentYear && (
                        <ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={(_, newMode) => newMode && handleViewModeChange(newMode)}
                            size="small"
                            fullWidth
                            sx={{
                                width: { xs: '100%', sm: 250 },
                            }}
                        >
                            <ToggleButton value="yearToday">
                                {t('dashboard.common.viewMode.yearToday')}
                            </ToggleButton>
                            <ToggleButton value="fullYear">
                                {t('dashboard.common.viewMode.fullYear')}
                            </ToggleButton>
                        </ToggleButtonGroup>
                    )}
                </Box>
            </Paper>

            {/* Monthly income/expense comparison chart */}
            <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
                <AnnualChart
                    transactions={filteredTransactions}
                    isLoading={isLoading && !isUpdatingViewMode}
                />
            </Paper>

            {/* Income, expense and balance summary */}
            <AnnualBalances 
                transactions={filteredTransactions} 
                isLoading={isLoading && !isUpdatingViewMode} 
            />

            {/* Categories breakdown and management */}
            <Paper elevation={3} sx={{ p: 1, borderRadius: 3 }}>
                <AnnualCategories
                    transactions={filteredTransactions}
                    isLoading={isLoading && !isUpdatingViewMode}
                />
            </Paper>
        </Box>
    );
}