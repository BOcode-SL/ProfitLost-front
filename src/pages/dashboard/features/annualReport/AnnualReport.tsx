import { useState, useEffect } from 'react';
import { Box, Paper, FormControl, Select, MenuItem, InputLabel, Fade, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { transactionService } from '../../../../services/transaction.service';
import type { Transaction } from '../../../../types/models/transaction';
import type { TransactionApiErrorResponse } from '../../../../types/api/responses';
import AnnualChart from './components/AnnualChart';
import AnnualCategories from './components/AnnualCategories';
import AnnualBalances from './components/AnnualBalances';

export default function AnnualReport() {
    const { t } = useTranslation();
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
                setLoading(false);
            }
        };

        fetchTransactionsByYear();
    }, [year, t]);

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
                    <Paper elevation={3} sx={{ p: 1, borderRadius: 3, width: '100%' }}>
                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'stretch', sm: 'center' }
                        }}>
                            <Fade in timeout={500}>
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
                            </Fade>

                            {year === currentYear && (
                                <Fade in timeout={500}>
                                    <ToggleButtonGroup
                                        value={viewMode}
                                        exclusive
                                        onChange={(_, newMode) => newMode && setViewMode(newMode)}
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
                                </Fade>
                            )}
                        </Box>
                    </Paper>

                    <Paper elevation={3} sx={{ p: 1, borderRadius: 3, mt: 2, width: '100%' }}>
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
                        <Paper elevation={3} sx={{ p: 1, borderRadius: 3, width: '100%', mt: 2 }}>
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