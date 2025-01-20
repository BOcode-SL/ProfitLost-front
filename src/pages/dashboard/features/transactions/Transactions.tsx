import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Box, Paper, FormControl, Select, MenuItem, InputLabel, Fade, useTheme } from '@mui/material';

import { useUser } from '../../../../contexts/UserContext';
import type { TransactionApiErrorResponse } from '../../../../types/api/responses';
import type { Transaction } from '../../../../types/models/transaction';
import { User } from '../../../../types/models/user';
import type { Category } from '../../../../types/models/category';
import { transactionService } from '../../../../services/transaction.service';
import { categoryService } from '../../../../services/category.service';
import TransactionPie from './components/TransactionPie';
import TransactionBarChart from './components/TransactionBarChart';
import TransactionBalances from './components/TransactionBalances';
import TransactionTable from './components/TransactionTable';

export default function Transactions() {
    const theme = useTheme();
    const { user } = useUser();
    const currentYear = new Date().getFullYear().toString();
    const [year, setYear] = useState<string>(currentYear);
    const [month, setMonth] = useState<string>(
        (new Date().getMonth() + 1).toString().padStart(2, '0')
    );
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [yearsWithData, setYearsWithData] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const [transactionsResponse, categoriesResponse, allTransactionsResponse] =
                await Promise.all([
                    transactionService.getTransactionsByYearAndMonth(year, month),
                    categoryService.getAllCategories(),
                    transactionService.getAllTransactions()
                ]);

            if (!transactionsResponse.success || !categoriesResponse.success || !allTransactionsResponse.success) {
                throw new Error('Error fetching data');
            }

            const years = new Set<string>(
                (allTransactionsResponse.data as Transaction[]).map(t =>
                    new Date(t.date).getFullYear().toString()
                )
            );
            years.add(currentYear);

            setYearsWithData(Array.from(years).sort((a, b) => Number(b) - Number(a)));
            setTransactions(transactionsResponse.data as Transaction[]);
            setCategories(categoriesResponse.data as Category[]);
        } catch (error: unknown) {
            const transactionError = error as TransactionApiErrorResponse;
            handleError(transactionError);
        } finally {
            setLoading(false);
        }
    }, [year, month, currentYear]);

    const handleError = (error: TransactionApiErrorResponse) => {
        switch (error.error) {
            case 'UNAUTHORIZED':
                toast.error('Session expired. Please log in again.');
                break;
            case 'CONNECTION_ERROR':
                toast.error('Connection error. Please check your internet connection.');
                break;
            case 'DATABASE_ERROR':
            case 'SERVER_ERROR':
                toast.error('Server error. Please try again later.');
                break;
            default:
                toast.error('Error loading data');
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const { incomeData, expensesData, totalIncome, totalExpenses } = useMemo(() => {
        const income: Record<string, number> = {};
        const expenses: Record<string, number> = {};
        let totalInc = 0;
        let totalExp = 0;

        transactions.forEach((transaction) => {
            const category = categories.find(c => c.name === transaction.category);
            if (!category) {
                console.warn('⚠️ No category found for transaction:', transaction);
                return;
            }

            if (transaction.amount > 0) {
                income[category.name] = (income[category.name] || 0) + transaction.amount;
                totalInc += transaction.amount;
            } else {
                const absAmount = Math.abs(transaction.amount);
                expenses[category.name] = (expenses[category.name] || 0) + absAmount;
                totalExp += absAmount;
            }
        });

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
        <Fade in timeout={400}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{
                    display: 'flex',
                    gap: 2
                }}>
                    <Paper elevation={2} sx={{
                        p: 1,
                        borderRadius: 3,
                        width: '100%'
                    }}>
                        <FormControl size="small" sx={{ width: '100%' }}>
                            <InputLabel>Year</InputLabel>
                            <Select
                                value={year}
                                label="Year"
                                onChange={(e) => setYear(e.target.value)}
                            >
                                {yearsWithData.map(y => (
                                    <MenuItem key={y} value={y}>{y}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Paper>

                    <Paper elevation={2} sx={{
                        p: 1,
                        borderRadius: 3,
                        width: '100%'
                    }}>
                        <FormControl size="small" sx={{ width: '100%' }}>
                            <InputLabel>Month</InputLabel>
                            <Select
                                value={month}
                                label="Month"
                                onChange={(e) => setMonth(e.target.value)}
                            >
                                {Array.from({ length: 12 }, (_, i) => {
                                    const monthNum = (i + 1).toString().padStart(2, '0');
                                    return (
                                        <MenuItem key={monthNum} value={monthNum}>
                                            {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Paper>
                </Box>

                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap',
                }}>
                    <TransactionPie
                        loading={loading}
                        data={incomeData}
                    />
                    <TransactionPie
                        loading={loading}
                        data={expensesData}
                    />
                    <TransactionBarChart
                        loading={loading}
                        month={month}
                        income={totalIncome}
                        expenses={totalExpenses}
                    />
                </Box>

                <TransactionBalances
                    totalIncome={totalIncome}
                    totalExpenses={totalExpenses}
                    user={user as User}
                />

                <Box>
                    <TransactionTable
                        data={transactions}
                        loading={loading}
                        categories={categories}
                        onReload={fetchData}
                    />
                </Box>
            </Box>
        </Fade>
    );
}