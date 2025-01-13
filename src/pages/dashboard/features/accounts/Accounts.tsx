import { useMemo, useState, useEffect } from 'react';
import { Box, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Fade } from '@mui/material';
import { toast } from 'react-hot-toast';

import type { Account } from '../../../../types/models/account.modelTypes';
import type { User } from '../../../../types/models/user.modelTypes';
import { accountService } from '../../../../services/account.service';
import { userService } from '../../../../services/user.service';

import AccountsChart from './components/AccountsChart';
import AccountsTable from './components/AccountsTable';

export default function Accounts() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [user, setUser] = useState<User | null>(null);

    const availableYears = useMemo(() => {
        const years = new Set<number>();
        const currentYear = new Date().getFullYear();
        years.add(currentYear);

        accounts.forEach(account => {
            account.records.forEach(record => {
                years.add(record.year);
            });
        });

        return Array.from(years).sort((a: number, b: number) => b - a);
    }, [accounts]);

    const fetchUserData = async () => {
        const response = await userService.getUserData();
        if (response.success && response.data) {
            setUser(response.data as User);
        }
    };

    const fetchAccounts = async () => {
        const response = await accountService.getAllAccounts();
        if (response.success && response.data) {
            setAccounts(response.data as Account[]);
        } else {
            toast.error(response.message || 'Error loading accounts');
        }
        setLoading(false);
    };

    useEffect(() => {
        Promise.all([fetchUserData(), fetchAccounts()]);
    }, []);

    const orderedAccounts = useMemo(() => {
        if (!user?.accountsOrder || !accounts.length) return accounts;

        const accountMap = new Map(accounts.map(acc => [acc._id, acc]));
        const orderedAccounts: Account[] = [];

        user.accountsOrder.forEach(id => {
            const account = accountMap.get(id);
            if (account) {
                orderedAccounts.push(account);
                accountMap.delete(id);
            }
        });

        accountMap.forEach(account => {
            orderedAccounts.push(account);
        });

        return orderedAccounts;
    }, [accounts, user?.accountsOrder]);

    const handleAccountUpdate = async (updatedAccount: Account) => {
        try {
            const response = await accountService.updateAccount(updatedAccount._id, {
                accountName: updatedAccount.accountName,
                configuration: updatedAccount.configuration,
                records: updatedAccount.records
            });

            if (response.success && response.data) {
                setAccounts(prev => prev.map(acc =>
                    acc._id === updatedAccount._id ? response.data as Account : acc
                ));
                toast.success('Account updated successfully');
                return true;
            } else {
                toast.error(response.message || 'Error updating account');
                await fetchAccounts();
                return false;
            }
        } catch (error) {
            console.error('❌ Error updating account:', error);
            toast.error('Error updating account');
            await fetchAccounts();
            return false;
        }
    };

    const handleAccountCreate = async (newAccount: Account): Promise<boolean> => {
        const response = await accountService.createAccount({
            accountName: newAccount.accountName,
            configuration: newAccount.configuration,
            records: newAccount.records
        });

        if (response.success && response.data) {
            setAccounts(prev => [...prev, response.data as Account]);
            toast.success('Account created successfully');
            return true;
        } else {
            toast.error(response.message || 'Error creating account');
            return false;
        }
    };

    const handleAccountDelete = async (accountId: string): Promise<boolean> => {
        const response = await accountService.deleteAccount(accountId);

        if (response.success) {
            setAccounts(prev => prev.filter(acc => acc._id !== accountId));
            toast.success('Account deleted successfully');
            return true;
        } else {
            toast.error(response.message || 'Error deleting account');
            return false;
        }
    };

    const handleOrderChange = async (newOrder: string[]) => {
        try {
            const response = await userService.updateAccountsOrder(newOrder);
            if (response.success) {
                setUser(prev => prev ? {
                    ...prev,
                    accountsOrder: newOrder
                } : null);
                toast.success('Accounts order updated successfully');
            } else {
                toast.error(response.message || 'Error updating accounts order');
            }
        } catch (error) {
            console.error('❌ Error updating accounts order:', error);
            toast.error('Error updating accounts order');
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
                            value={selectedYear}
                            label="Year"
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            {availableYears.map(year => (
                                <MenuItem key={year} value={year.toString()}>
                                    {year}
                                </MenuItem>
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
                        accounts={orderedAccounts}
                        loading={loading}
                        selectedYear={Number(selectedYear)}
                    />
                </Paper>

                <AccountsTable
                    accounts={orderedAccounts}
                    loading={loading}
                    selectedYear={Number(selectedYear)}
                    onUpdate={handleAccountUpdate}
                    onCreate={handleAccountCreate}
                    onDelete={handleAccountDelete}
                    onOrderChange={handleOrderChange}
                />
            </Box>
        </Fade>
    );
} 