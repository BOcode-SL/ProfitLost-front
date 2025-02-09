import { useMemo, useState, useEffect, useCallback } from 'react';
import { Box, Paper, FormControl, InputLabel, Select, MenuItem, Fade } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// Services
import { accountService } from '../../../../services/account.service';
import { userService } from '../../../../services/user.service';

// Types
import type { Account } from '../../../../types/models/account';
import type { User } from '../../../../types/models/user';

// Components
import AccountsChart from './components/AccountsChart';
import AccountsTable from './components/AccountsTable';

// Accounts component
export default function Accounts() {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

    // Memoized available years based on accounts records
    const availableYears = useMemo(() => {
        const years = new Set<number>();
        const currentYear = new Date().getFullYear();
        years.add(currentYear);

        accounts.forEach(account => {
            Object.keys(account.records).forEach(year => {
                years.add(parseInt(year));
            });
        });

        return Array.from(years).sort((a: number, b: number) => b - a);
    }, [accounts]);

    // Fetch user data from the user service
    const fetchUserData = useCallback(async () => {
        const response = await userService.getUserData();
        if (response.success && response.data) {
            setUser(response.data as User);
        }
    }, []);

    // Fetch all accounts from the account service
    const fetchAccounts = useCallback(async () => {
        const response = await accountService.getAllAccounts();
        if (response.success && response.data) {
            setAccounts(response.data as Account[]);
        } else {
            toast.error(t('dashboard.accounts.errors.loadingError'));
        }
        setLoading(false);
    }, [t]);

    // useEffect to fetch user data and accounts on component mount
    useEffect(() => {
        Promise.all([fetchUserData(), fetchAccounts()]);
    }, [fetchUserData, fetchAccounts]);

    // Memoized ordered accounts based on user accounts order
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

    // Handle account update
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
                toast.success(t('dashboard.accounts.success.accountUpdated'));
                return true;
            } else {
                toast.error(t('dashboard.accounts.errors.updateError'));
                await fetchAccounts();
                return false;
            }
        } catch (error) {
            console.error('❌ Error updating account:', error);
            toast.error(t('dashboard.accounts.errors.updateError'));
            await fetchAccounts();
            return false;
        }
    };

    // Handle account creation
    const handleAccountCreate = async (newAccount: Account): Promise<boolean> => {
        const response = await accountService.createAccount({
            accountName: newAccount.accountName,
            configuration: newAccount.configuration,
            records: newAccount.records
        });

        if (response.success && response.data) {
            setAccounts(prev => [...prev, response.data as Account]);
            toast.success(t('dashboard.accounts.success.accountCreated'));
            return true;
        } else {
            toast.error(t('dashboard.accounts.errors.createError'));
            return false;
        }
    };

    // Handle account deletion
    const handleAccountDelete = async (accountId: string): Promise<boolean> => {
        const response = await accountService.deleteAccount(accountId);

        if (response.success) {
            setAccounts(prev => prev.filter(acc => acc._id !== accountId));
            toast.success(t('dashboard.accounts.success.accountDeleted'));
            return true;
        } else {
            toast.error(t('dashboard.accounts.errors.deleteError'));
            return false;
        }
    };

    // Handle order change of accounts
    const handleOrderChange = async (newOrder: string[]) => {
        try {
            const response = await userService.updateAccountsOrder(newOrder);
            if (response.success) {
                setUser(prev => prev ? {
                    ...prev,
                    accountsOrder: newOrder
                } : null);
                toast.success(t('dashboard.accounts.success.accountsOrderUpdated'));
            } else {
                toast.error(t('dashboard.accounts.errors.accountsOrderError'));
            }
        } catch (error) {
            console.error('❌ Error updating accounts order:', error);
            toast.error(t('dashboard.accounts.errors.accountsOrderError'));
        }
    };

    // Memoized active and inactive accounts
    const { activeAccounts, inactiveAccounts } = useMemo(() => {
        return {
            activeAccounts: orderedAccounts.filter(account => account.configuration.isActive !== false),
            inactiveAccounts: orderedAccounts.filter(account => account.configuration.isActive === false)
        };
    }, [orderedAccounts]);

    // Fade transition for the entire content
    return (
        <Fade in timeout={400}>
            {/* Container for the main content, arranged in a column */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%'
            }}>
                {/* Paper component for the year selection dropdown */}
                <Paper elevation={2} sx={{
                    p: 1,
                    borderRadius: 3,
                    width: '100%'
                }}>
                    {/* Form control for selecting the year */}
                    <FormControl size="small" fullWidth sx={{ minWidth: 120 }}>
                        <InputLabel>{t('dashboard.common.year')}</InputLabel>
                        <Select
                            value={selectedYear}
                            label={t('dashboard.common.year')}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            {/* Mapping through available years to create menu items */}
                            {availableYears.map(year => (
                                <MenuItem key={year} value={year.toString()}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>

                {/* Paper component for displaying the accounts chart */}
                <Paper elevation={2} sx={{
                    p: 2,
                    borderRadius: 3,
                    width: '100%',
                    height: '400px'
                }}>
                    {/* Accounts chart component with active accounts and selected year */}
                    <AccountsChart
                        accounts={activeAccounts}
                        loading={loading}
                        selectedYear={Number(selectedYear)}
                    />
                </Paper>

                {/* Accounts table component for displaying active and inactive accounts */}
                <AccountsTable
                    accounts={activeAccounts}
                    inactiveAccounts={inactiveAccounts}
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