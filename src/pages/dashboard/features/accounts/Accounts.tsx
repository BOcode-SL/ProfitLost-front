import { useState, useEffect, useMemo } from 'react';
import { Box, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Fade } from '@mui/material';

import { accountService } from '../../../../services/account.service';
import { userService } from '../../../../services/user.service';
import type { Account } from '../../../../types/models/account.modelTypes';
import AccountsChart from './components/AccountsChart';
import AccountsTable from './components/AccountsTable';

export default function Accounts() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());
    const [yearsWithData, setYearsWithData] = useState<number[]>([]);

    const activeAccounts = useMemo(() => {
        return accounts.filter(account => account.configuration.isActive !== false);
    }, [accounts]);

    const orderAccounts = (accountsToOrder: Account[], accountsOrder: string[]) => {
        if (!accountsOrder?.length) return accountsToOrder;

        const orderedAccounts = [...accountsToOrder];
        orderedAccounts.sort((a, b) => {
            const indexA = accountsOrder.indexOf(a._id);
            const indexB = accountsOrder.indexOf(b._id);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });

        return orderedAccounts;
    };

    useEffect(() => {
        const fetchAccounts = async () => {
            setLoading(true);
            try {
                const [accountsResponse, userResponse] = await Promise.all([
                    accountService.getAllAccounts(),
                    userService.getUserData()
                ]);

                if (accountsResponse.success && accountsResponse.data) {
                    const accountsData = Array.isArray(accountsResponse.data) 
                        ? accountsResponse.data 
                        : [accountsResponse.data];

                    // Verificar si userResponse es un éxito antes de acceder a data
                    if (userResponse.success && userResponse.data) {
                        const orderedAccounts = orderAccounts(accountsData, userResponse.data.accountsOrder);
                        setAccounts(orderedAccounts);
                    }

                    // Obtener años únicos con datos
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

    const handleReorder = async (reorderedAccounts: Account[]) => {
        try {
            // Actualizamos el estado local
            setAccounts(reorderedAccounts);
            
            // Actualizamos el orden en el backend
            const accountIds = reorderedAccounts.map(account => account._id);
            await userService.updateAccountsOrder(accountIds);
        } catch (error) {
            console.error('Error updating accounts order:', error);
            // Aquí podrías mostrar un mensaje de error al usuario
        }
    };

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

                <AccountsTable 
                    accounts={activeAccounts}
                    loading={loading}
                    selectedYear={parseInt(year)}
                    onReorder={handleReorder}
                />
            </Box>
        </Fade>
    );
} 