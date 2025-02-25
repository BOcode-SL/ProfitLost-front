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
import type { Transaction } from '../../../../types/models/transaction';
import type { TransactionApiErrorResponse } from '../../../../types/api/responses';

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

    // Set the view mode from the user preferences
    useEffect(() => {
        if (user?.preferences.viewMode) {
            setViewMode(user.preferences.viewMode);
        }
    }, [user?.preferences.viewMode]);

    // Fetch all transactions
    useEffect(() => {
        const fetchAllTransactions = async () => {
            try {
                const response = await transactionService.getAllTransactions();
                if (response.success && Array.isArray(response.data)) {
                    const transactionYears = new Set(
                        response.data.map((transaction: Transaction) =>
                            new Date(transaction.date).getFullYear().toString()
                        )
                    );

                    transactionYears.add(currentYear);

                    const sortedYears = [...transactionYears].sort((a, b) => Number(b) - Number(a));
                    setYearsWithData(sortedYears);
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
            }
        };

        fetchAllTransactions();
    }, [currentYear, t]);

    // Fetch transactions by year
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

    // Filter transactions by view mode
    const filteredTransactions = transactions.filter(transaction => {
        if (viewMode === 'yearToday') {
            const today = new Date();
            const transactionDate = new Date(transaction.date);
            return transactionDate <= today;
        }
        return true;
    });

    // Handle view mode change
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
            {/* Year selection paper */}
            <Paper elevation={3} sx={{ p: 1, borderRadius: 3, width: '100%' }}>
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' }
                }}>
                    {/* Year selection dropdown */}
                    <FormControl size="small"
                        sx={{
                            flexGrow: 1,
                            minWidth: { xs: '100%', sm: 200 },
                        }}>
                        <InputLabel>{t('dashboard.common.year')}</InputLabel>
                        <Select
                            value={year}
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

                    {/* View mode toggle buttons (only shown for the current year) */}
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

            {/* Chart paper displaying annual data */}
            <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
                <AnnualChart
                    transactions={filteredTransactions}
                    isLoading={isLoading && !isUpdatingViewMode}
                />
            </Paper>

            {/* Component displaying annual balances */}
            <AnnualBalances 
                transactions={filteredTransactions} 
                isLoading={isLoading && !isUpdatingViewMode} 
            />

            {/* Categories paper displaying annual categories */}
            <Paper elevation={3} sx={{ p: 1, borderRadius: 3 }}>
                <AnnualCategories
                    transactions={filteredTransactions}
                    isLoading={isLoading && !isUpdatingViewMode}
                />
            </Paper>
        </Box>
    );
}