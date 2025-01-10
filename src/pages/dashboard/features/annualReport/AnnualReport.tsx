import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

import { transactionService } from '../../../../services/transaction.service';
import type { Transaction } from '../../../../types/models/transaction.modelTypes';
import type { TransactionApiErrorResponse } from '../../../../types/services/transaction.serviceTypes';
import AnnualChart from './components/AnnualChart';
import './AnnualReport.scss';

export default function AnnualReport() {
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
                    const years = new Set(
                        response.data.map((transaction: Transaction) =>
                            new Date(transaction.date).getFullYear().toString()
                        )
                    );
                    setYearsWithData([...years].sort((a, b) => Number(b) - Number(a)));
                }
            } catch (error: unknown) {
                const err = error as TransactionApiErrorResponse;
                toast.error(err.message || 'Error loading years');
            }
        };

        fetchAllTransactions();
    }, []);

    useEffect(() => {
        const fetchTransactionsByYear = async () => {
            setLoading(true);
            try {
                const response = await transactionService.getTransactionsByYear(year);
                if (response.success && Array.isArray(response.data)) {
                    setTransactions(response.data);
                }
            } catch (error: unknown) {
                const err = error as TransactionApiErrorResponse;
                toast.error(err.message || 'Error loading transactions');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactionsByYear();
    }, [year]);

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
                        <InputLabel>Año</InputLabel>
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
                    mt: 3,
                    width: '100%'
                }}>
                    <AnnualChart transactions={transactions} loading={loading} />
                </Paper>
            </Box>
        </Box>
    );
}