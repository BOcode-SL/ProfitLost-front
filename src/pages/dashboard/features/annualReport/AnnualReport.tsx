import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

import { useUser } from '../../../../contexts/UserContext';
import { transactionService } from '../../../../services/transaction.service';
import { formatCurrency } from '../../../../utils/formatCurrency';
import type { Transaction } from '../../../../types/models/transaction.modelTypes';
import type { TransactionApiErrorResponse } from '../../../../types/services/transaction.serviceTypes';

import AnnualChart from './components/AnnualChart';
import AnnualCategories from './components/AnnualCategories';

export default function AnnualReport() {
    const { user } = useUser();
    const currentYear = new Date().getFullYear().toString();
    const [year, setYear] = useState(currentYear);
    const [yearsWithData, setYearsWithData] = useState<string[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

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
                        toast.error('Expired session. Please log in again.');
                        break;
                    case 'CONNECTION_ERROR':
                        toast.error('Connection error. Please check your internet connection.');
                        break;
                    case 'DATABASE_ERROR':
                    case 'SERVER_ERROR':
                        toast.error('Server error. Please try again later.');
                        break;
                    default:
                        toast.error('Error loading years');
                }
            }
        };

        fetchAllTransactions();
    }, [currentYear]);

    useEffect(() => {
        const fetchTransactionsByYear = async () => {
            setLoading(true);
            try {
                const response = await transactionService.getTransactionsByYear(year);
                if (response.success && Array.isArray(response.data)) {
                    setTransactions(response.data);
                }
            } catch (error: unknown) {
                const transactionError = error as TransactionApiErrorResponse;
                switch (transactionError.error) {
                    case 'INVALID_DATE_FORMAT':
                        toast.error('Invalid date format');
                        break;
                    case 'UNAUTHORIZED':
                        toast.error('Expired session. Please log in again.');
                        break;
                    case 'CONNECTION_ERROR':
                        toast.error('Connection error. Please check your internet connection.');
                        break;
                    case 'DATABASE_ERROR':
                    case 'SERVER_ERROR':
                        toast.error('Server error. Please try again later.');
                        break;
                    default:
                        toast.error('Error loading transactions');
                }
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactionsByYear();
    }, [year]);

    const totals = useMemo(() => {
        const { income, expenses } = transactions.reduce((acc, transaction) => {
            if (transaction.amount > 0) {
                acc.income += transaction.amount;
            } else {
                acc.expenses += Math.abs(transaction.amount);
            }
            return acc;
        }, { income: 0, expenses: 0 });

        return {
            income,
            expenses,
            balance: income - expenses
        };
    }, [transactions]);

    return (
        <Box className="annual-report">
            <Box className="annual-report__content">
                <Paper elevation={2} sx={{
                    p: 1,
                    borderRadius: 3,
                    width: '100%'
                }}>
                    <FormControl
                        fullWidth
                        size="small"
                        sx={{ minWidth: { xs: '100%', sm: 200 } }}
                    >
                        <InputLabel>Year</InputLabel>
                        <Select
                            value={year}
                            label="Year"
                            onChange={(e) => setYear(e.target.value)}
                        >
                            {yearsWithData.map((yearOption) => (
                                <MenuItem key={yearOption} value={yearOption}>
                                    {yearOption}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>

                <Paper elevation={2} sx={{
                    p: 1,
                    borderRadius: 3,
                    mt: 2,
                    width: '100%'
                }}>
                    <AnnualChart transactions={transactions} loading={loading} />
                </Paper>

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                    gap: 1,
                    mt: 2
                }}>
                    <Paper elevation={2} sx={{
                        p: 1,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2
                    }}>
                        <span className="material-symbols-rounded" style={{ color: '#ff8e38', fontSize: '2rem' }}>
                            download
                        </span>
                        <span style={{ fontSize: '1.5rem' }}>
                            {formatCurrency(totals.income, user)}
                        </span>
                    </Paper>

                    <Paper elevation={2} sx={{
                        p: 1,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2
                    }}>
                        <span className="material-symbols-rounded" style={{ color: '#9d300f', fontSize: '2rem' }}>
                            upload
                        </span>
                        <span style={{ fontSize: '1.5rem' }}>
                            {formatCurrency(totals.expenses, user)}
                        </span>
                    </Paper>

                    <Paper elevation={2} sx={{
                        p: 1,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2
                    }}>
                        {totals.balance > 0 ? (
                            <span className="material-symbols-rounded" style={{ color: '#4CAF50', fontSize: '2rem' }}>
                                savings
                            </span>
                        ) : (
                            <span className="material-symbols-rounded" style={{ color: '#f44336', fontSize: '2rem' }}>
                                savings
                            </span>
                        )}
                        <span style={{ fontSize: '1.5rem' }}>
                            {formatCurrency(totals.balance, user)}
                        </span>
                    </Paper>
                </Box>

                <Paper elevation={2} sx={{
                    p: 1,
                    borderRadius: 3,
                    width: '100%',
                    mt: 2
                }}>
                    <AnnualCategories 
                        transactions={transactions}
                        loading={loading}
                    />
                </Paper>
            </Box>
        </Box>
    );
}