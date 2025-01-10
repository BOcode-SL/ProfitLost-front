import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { useTheme } from '@mui/material/styles';

import { useUser } from '../../../../contexts/UserContext';
import { User } from '../../../../types/models/user.modelTypes';
import { transactionService } from '../../../../services/transaction.service';
import type { Transaction } from '../../../../types/models/transaction.modelTypes';
import type { TransactionApiErrorResponse } from '../../../../types/services/transaction.serviceTypes';
import { categoryService } from '../../../../services/category.service';
import type { Category } from '../../../../types/models/category.modelTypes';

import TransactionPie from './components/TransactionPie';
import TransactionBarChart from './components/TransactionBarChart';
import TransactionBalances from './components/TransactionBalances';
import TransactionTable from './components/TransactionTable';

export default function Transactions() {
    const theme = useTheme();
    const { user } = useUser();
    const currentYear = new Date().getFullYear().toString();
    const [year, setYear] = useState<string>(currentYear);
    const [month, setMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, '0'));
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [yearsWithData, setYearsWithData] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const [transactionsResponse, categoriesResponse, allTransactionsResponse] = await Promise.all([
                transactionService.getTransactionsByYearAndMonth(year, month),
                categoryService.getAllCategories(),
                transactionService.getAllTransactions()
            ]);

            if (transactionsResponse.success && categoriesResponse.success && allTransactionsResponse.success) {
                const years = new Set<string>(
                    (allTransactionsResponse.data as Transaction[]).map(t =>
                        new Date(t.date).getFullYear().toString()
                    )
                );
                years.add(currentYear);
                setYearsWithData(Array.from(years).sort((a, b) => Number(b) - Number(a)));
                setTransactions(transactionsResponse.data as Transaction[]);
                setCategories(categoriesResponse.data as Category[]);
            }
        } catch (error: unknown) {
            const transactionError = error as TransactionApiErrorResponse;
            switch (transactionError.error) {
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
        } finally {
            setLoading(false);
        }
    }, [year, month, currentYear]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Calculate totals by category using the current Transaction model
    const { incomeData, expensesData, totalIncome, totalExpenses } = useMemo(() => {

        const income: { [key: string]: number } = {};
        const expenses: { [key: string]: number } = {};

        transactions.forEach((transaction) => {
            const category = categories.find(c => c.name === transaction.category);
            if (!category) {
                console.warn('⚠️ No category found for transaction:', transaction);
                return;
            }

            if (transaction.amount > 0) {
                income[category.name] = (income[category.name] || 0) + transaction.amount;
            } else {
                expenses[category.name] = (expenses[category.name] || 0) + Math.abs(transaction.amount);
            }
        });

        const incomeData = Object.entries(income).map(([name, value]) => ({
            id: name,
            value,
            label: name,
            color: categories.find(c => c.name === name)?.color || theme.palette.primary.main
        }));

        const expensesData = Object.entries(expenses).map(([name, value]) => ({
            id: name,
            value,
            label: name,
            color: categories.find(c => c.name === name)?.color || theme.palette.error.main
        }));


        const totalIncome = transactions.reduce((acc, { amount }) =>
            amount > 0 ? acc + amount : acc, 0
        );

        const totalExpenses = transactions.reduce((acc, { amount }) =>
            amount < 0 ? acc + Math.abs(amount) : acc, 0
        );

        return { incomeData, expensesData, totalIncome, totalExpenses };
    }, [transactions, categories, theme]);

    return (
        <Box className='transactions' sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box className='transactions__selectors' sx={{ display: 'flex', gap: 2 }}>
                <Paper
                    elevation={2}
                    sx={{
                        p: 1,
                        borderRadius: 3,
                        width: '100%'
                    }}>

                    <FormControl
                        size="small"
                        sx={{ width: '100%' }}>
                        <InputLabel>Year</InputLabel>
                        <Select
                            value={year}
                            label="Year"
                            onChange={(e) => setYear(e.target.value)}
                        >
                            {yearsWithData.map((y) => (
                                <MenuItem key={y} value={y}>{y}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>
                <Paper
                    elevation={2}
                    sx={{
                        p: 1,
                        borderRadius: 3,
                        width: '100%'
                    }}>
                    <FormControl
                        size="small"
                        sx={{ width: '100%' }}>
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
                    income={totalIncome}
                    expenses={totalExpenses}
                />
            </Box>

            <TransactionBalances
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                user={user as User}
            />

            <TransactionTable
                data={transactions}
                loading={loading}
                categories={categories}
                onReload={fetchData}
            />
        </Box>
    );
}