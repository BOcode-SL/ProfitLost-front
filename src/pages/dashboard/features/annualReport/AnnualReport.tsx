import { useState, useEffect } from 'react';
import { Box, Paper, FormControl, Select, MenuItem, InputLabel, Fade, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { toast } from 'react-hot-toast';

import { transactionService } from '../../../../services/transaction.service';
import type { Transaction } from '../../../../types/models/transaction';
import type { TransactionApiErrorResponse } from '../../../../types/api/responses';
import AnnualChart from './components/AnnualChart';
import AnnualCategories from './components/AnnualCategories';
import AnnualBalances from './components/AnnualBalances';

export default function AnnualReport() {
    const currentYear = new Date().getFullYear().toString();
    const [year, setYear] = useState(currentYear);
    const [yearsWithData, setYearsWithData] = useState<string[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'yearToday' | 'fullYear'>('fullYear');

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
                const response = await transactionService.getTransactionsByYear(Number(year));
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

    const filteredTransactions = transactions.filter(transaction => {
        if (viewMode === 'yearToday') {
            const today = new Date();
            const transactionDate = new Date(transaction.date);
            return transactionDate <= today;
        }
        return true;
    });

    return (
        <Box className="annual-report">
            <Fade in timeout={400}>
                <Box className="annual-report__content">
                    <Paper elevation={2} sx={{ p: 1, borderRadius: 3, width: '100%' }}>
                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'stretch', sm: 'center' }
                        }}>
                            <Fade in timeout={500}>
                                <FormControl size="small" sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 200 } }}>
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
                            </Fade>

                            <Fade in timeout={500}>
                                <ToggleButtonGroup
                                    value={viewMode}
                                    exclusive
                                    onChange={(_, newMode) => newMode && setViewMode(newMode)}
                                    size="small"
                                >
                                    <ToggleButton value="yearToday">
                                        Year Today
                                    </ToggleButton>
                                    <ToggleButton value="fullYear">
                                        Full Year
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Fade>
                        </Box>
                    </Paper>

                    <Paper elevation={2} sx={{ p: 1, borderRadius: 3, mt: 2, width: '100%' }}>
                        <Fade in timeout={600}>
                            <Box>
                                <AnnualChart
                                    transactions={filteredTransactions}
                                    loading={loading}
                                />
                            </Box>
                        </Fade>
                    </Paper>

                    <AnnualBalances transactions={filteredTransactions} />

                    <Fade in timeout={800}>
                        <Paper elevation={2} sx={{ p: 1, borderRadius: 3, width: '100%', mt: 2 }}>
                            <AnnualCategories
                                transactions={filteredTransactions}
                                loading={loading}
                            />
                        </Paper>
                    </Fade>
                </Box>
            </Fade>
        </Box>
    );
}