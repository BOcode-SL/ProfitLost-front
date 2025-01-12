import { useState, useEffect, useMemo } from 'react';
import { Box, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Fade } from '@mui/material';

import { accountService } from '../../../../services/account.service';
import type { Account } from '../../../../types/models/account.modelTypes';
import AccountsChart from './components/AccountsChart';

export default function Accounts() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());
    const [yearsWithData, setYearsWithData] = useState<number[]>([]);

    const activeAccounts = useMemo(() => {
        return accounts.filter(account => account.configuration.isActive !== false);
    }, [accounts]);

    useEffect(() => {
        const fetchAccounts = async () => {
            setLoading(true);
            try {
                const response = await accountService.getAllAccounts();
                if (response.success && response.data) {
                    const accountsData = Array.isArray(response.data) ? response.data : [response.data];
                    setAccounts(accountsData);

                    // Obtain unique years with data
                    const years = new Set<number>();
                    const currentYear = new Date().getFullYear();
                    years.add(currentYear);

                    accountsData.forEach(account => {
                        account.records.forEach(record => {
                            if (record.value !== 0) {
                                years.add(record.year);
                            }
                        });
                    });

                    setYearsWithData(Array.from(years).sort((a, b) => b - a));
                }
            } catch (error) {
                console.error('Error fetching accounts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    useEffect(() => {
        const fetchAccountsByYear = async () => {
            setLoading(true);
            try {
                const response = await accountService.getAccountsByYear(parseInt(year));
                if (response.success && response.data) {
                    const accountsData = Array.isArray(response.data) ? response.data : [response.data];
                    setAccounts(accountsData);
                }
            } catch (error) {
                console.error('Error fetching accounts by year:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccountsByYear();
    }, [year]);

    return (
        <Fade in timeout={400}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%'
            }}>
                <Paper elevation={2} sx={{
                    p: 1,
                    borderRadius: 3,
                    width: '100%'
                }}>
                    <FormControl size="small" fullWidth sx={{ minWidth: 120 }}>
                        <InputLabel>Year</InputLabel>
                        <Select
                            value={year}
                            label="Year"
                            onChange={(e) => setYear(e.target.value)}
                        >
                            {yearsWithData.map(y => (
                                <MenuItem key={y} value={y.toString()}>{y}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>

                <Paper elevation={2} sx={{
                    p: 2,
                    borderRadius: 3,
                    width: '100%',
                    height: '400px'
                }}>
                    <AccountsChart
                        accounts={activeAccounts}
                        loading={loading}
                        selectedYear={parseInt(year)}
                    />
                </Paper>
            </Box>
        </Fade>
    );
} 