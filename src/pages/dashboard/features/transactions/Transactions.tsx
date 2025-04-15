/**
 * Transactions Module
 * 
 * Comprehensive financial transaction management dashboard with data
 * visualization, filtering capabilities, and detailed transaction listing.
 * 
 * Key Features:
 * - Year and month filtering for targeted financial analysis
 * - Multi-dimensional data visualization with charts and summaries
 * - Real-time financial metrics calculation and display
 * - Category-based income and expense breakdowns
 * - Data fetching with loading states and error handling
 * - User feedback for error conditions with localized messages
 * - Responsive layout adapting to different viewport sizes
 * - Event-based transaction updates for real-time data synchronization
 * 
 * @module Transactions
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Box, Paper, FormControl, Select, MenuItem, InputLabel, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Contexts
import { useUser } from '../../../../contexts/UserContext';

// Types
import type { TransactionApiErrorResponse } from '../../../../types/api/responses';
import type { Transaction } from '../../../../types/supabase/transactions';
import type { Category } from '../../../../types/supabase/categories';

// Services
import { transactionService } from '../../../../services/transaction.service';
import { categoryService } from '../../../../services/category.service';

// Utils
import { TRANSACTION_UPDATED_EVENT } from '../../../../utils/events';

// Components
import TransactionPie from './components/TransactionPie';
import TransactionBarChart from './components/TransactionBarChart';
import TransactionBalances from './components/TransactionBalances';
import TransactionTable from './components/TransactionTable';

/**
 * Standard month abbreviations in English
 * Used for localized month selection and display
 */
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Transactions Component
 * 
 * Main container for the transactions dashboard that manages data fetching,
 * filtering, and presentation of financial information.
 * 
 * @returns {JSX.Element} Rendered transactions dashboard
 */
export default function Transactions() {
    const { t } = useTranslation();
    const theme = useTheme();
    const { user } = useUser();

    /**
     * Component State
     */
    // Initialize with current date information for default filters
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    
    /** Selected year for filtering transactions */
    const [year, setYear] = useState<string>(currentYear);
    
    /** Selected month for filtering transactions (1-12, zero-padded) */
    const [month, setMonth] = useState<string>(
        (currentDate.getMonth() + 1).toString().padStart(2, '0')
    );
    
    /** Transaction data for the selected period */
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    
    /** Available categories for transaction categorization */
    const [categories, setCategories] = useState<Category[]>([]);
    
    /** Years that contain transaction data */
    const [yearsWithData, setYearsWithData] = useState<string[]>([]);
    
    /** Loading state during data fetching */
    const [loading, setLoading] = useState(true);

    /**
     * Handles API errors with appropriate user feedback
     * Maps error types to localized error messages
     * 
     * @param {TransactionApiErrorResponse} error - Error response from API
     */
    const handleError = useCallback((error: TransactionApiErrorResponse) => {
        switch (error.error) {
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
    }, [t]);

    /**
     * Fetches transaction and category data from API
     * Uses parallel promises for optimal loading performance
     */
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const [transactionsResponse, categoriesResponse, yearsResponse] =
                await Promise.all([
                    transactionService.getTransactionsByYearAndMonth(year, month),
                    categoryService.getAllCategories(),
                    transactionService.getTransactionYears()
                ]);

            if (!transactionsResponse.success || !categoriesResponse.success || !yearsResponse.success) {
                throw new Error('Error fetching data');
            }

            // Process and store response data
            setYearsWithData(yearsResponse.data as string[]);
            setTransactions(transactionsResponse.data as Transaction[]);
            setCategories(categoriesResponse.data as Category[]);

            // Ensure at least current year is available for selection
            if ((yearsResponse.data as string[]).length === 0) {
                setYearsWithData([currentYear]);
            }
        } catch (error: unknown) {
            const transactionError = error as TransactionApiErrorResponse;
            handleError(transactionError);
        } finally {
            setLoading(false);
        }
    }, [year, month, handleError, currentYear]);

    /**
     * Fetch data when component mounts or when year/month selection changes
     */
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /**
     * Listen for transaction update events and refresh data
     * Provides real-time updates when transactions change elsewhere
     */
    useEffect(() => {
        const handleTransactionUpdated = () => {
            fetchData();
        };

        window.addEventListener(TRANSACTION_UPDATED_EVENT, handleTransactionUpdated);

        return () => {
            window.removeEventListener(TRANSACTION_UPDATED_EVENT, handleTransactionUpdated);
        };
    }, [fetchData]);

    /**
     * Process transaction data for visualization components
     * Calculates totals and formats data for pie charts
     */
    const { incomeData, expensesData, totalIncome, totalExpenses } = useMemo(() => {
        const income: Record<string, number> = {};
        const expenses: Record<string, number> = {};
        let totalInc = 0;
        let totalExp = 0;

        // Group transactions by category and calculate totals
        transactions.forEach((transaction) => {
            const amount = typeof transaction.amount === 'string'
                ? parseFloat(transaction.amount)
                : transaction.amount;

            const category = categories.find(c => c.id === transaction.category_id);
            if (!category) {
                console.warn('⚠️ No category found for the transaction:', transaction);
                return;
            }

            // Separate income and expenses for different visualizations
            if (amount > 0) {
                income[category.name] = (income[category.name] || 0) + amount;
                totalInc += amount;
            } else {
                const absAmount = Math.abs(amount);
                expenses[category.name] = (expenses[category.name] || 0) + absAmount;
                totalExp += absAmount;
            }
        });

        // Format data for pie charts with appropriate styling
        return {
            incomeData: Object.entries(income).map(([name, value]) => ({
                id: name,
                value,
                label: name,
                color: categories.find(c => c.name === name)?.color || theme.palette.primary.main
            })),
            expensesData: Object.entries(expenses).map(([name, value]) => ({
                id: name,
                value,
                label: name,
                color: categories.find(c => c.name === name)?.color || theme.palette.error.main
            })),
            totalIncome: totalInc,
            totalExpenses: totalExp
        };
    }, [transactions, categories, theme.palette]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Period selection filters */}
            <Box sx={{
                display: 'flex',
                gap: 2
            }}>
                {/* Year selection dropdown */}
                <Paper elevation={3} sx={{
                    p: 1,
                    borderRadius: 3,
                    width: '100%'
                }}>
                    <FormControl size="small" sx={{ width: '100%' }}>
                        <InputLabel>{t('dashboard.common.year')}</InputLabel>
                        <Select
                            value={year}
                            label={t('dashboard.common.year')}
                            onChange={(e) => setYear(e.target.value)}
                        >
                            {/* Display years with transaction data or fallback to current year */}
                            {yearsWithData.length > 0
                                ? yearsWithData.map(y => (
                                    <MenuItem key={y} value={y}>{y}</MenuItem>
                                ))
                                : <MenuItem value={currentYear}>{currentYear}</MenuItem>
                            }
                        </Select>
                    </FormControl>
                </Paper>

                {/* Month selection dropdown */}
                <Paper elevation={3} sx={{
                    p: 1,
                    borderRadius: 3,
                    width: '100%'
                }}>
                    <FormControl size="small" sx={{ width: '100%' }}>
                        <InputLabel>{t('dashboard.common.month')}</InputLabel>
                        <Select
                            value={month}
                            label={t('dashboard.common.month')}
                            onChange={(e) => setMonth(e.target.value)}
                        >
                            {/* Generate month options with localized names */}
                            {Array.from({ length: 12 }, (_, i) => {
                                const monthNum = (i + 1).toString().padStart(2, '0');
                                return (
                                    <MenuItem key={monthNum} value={monthNum}>
                                        {t(`dashboard.common.monthNames.${months[i]}`)}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Paper>
            </Box>

            {/* Financial data visualization section */}
            <Box sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
            }}>
                {/* Income distribution by category */}
                <TransactionPie
                    loading={loading}
                    data={incomeData}
                />
                {/* Expenses distribution by category */}
                <TransactionPie
                    loading={loading}
                    data={expensesData}
                />
                {/* Monthly income vs expenses comparison */}
                <TransactionBarChart
                    loading={loading}
                    month={month}
                    income={totalIncome}
                    expenses={totalExpenses}
                />
            </Box>

            {/* Financial summary metrics */}
            <TransactionBalances
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                user={user}
                loading={loading}
            />

            {/* Detailed transaction listing with management capabilities */}
            <Box>
                <TransactionTable
                    data={transactions}
                    loading={loading}
                    categories={categories}
                    onReload={fetchData}
                />
            </Box>
        </Box>
    );
}