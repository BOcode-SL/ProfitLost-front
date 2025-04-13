/**
 * Accounts Feature Component
 * 
 * Main component for the Accounts section of the dashboard, providing features for:
 * - Viewing account balances by month and year
 * - Creating, editing, and managing multiple accounts
 * - Visualizing account data through charts
 * - Preserving user preferences for account display order
 * - Toggling active/inactive accounts
 */
import { useMemo, useState, useEffect, useCallback } from 'react';
import { Box, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// Services
import { accountService } from '../../../../services/account.service';
import { userService } from '../../../../services/user.service';

// Types
import type { Account } from '../../../../types/supabase/account';
import type { YearRecord } from '../../../../types/supabase/year_record';
import type { User } from '../../../../types/supabase/user';
import type { UUID } from '../../../../types/supabase/common';

// Extended types for relationships
interface AccountWithYearRecords extends Account {
    year_records?: YearRecord[];
    yearRecords?: Record<string, YearRecord>;
    yearRecord?: YearRecord;
    configuration?: {
        backgroundColor: string;
        color: string;
        isActive: boolean;
    };
    accountOrder?: number;
}

interface UserWithPreferences extends User {
    accounts_order?: UUID[];
}

// Components
import AccountsChart from './components/AccountsChart';
import AccountsTable from './components/AccountsTable';

// Main Accounts component for the dashboard
export default function Accounts() {
    const { t } = useTranslation();

    // State management
    const [loading, setLoading] = useState(true);
    const [accounts, setAccounts] = useState<AccountWithYearRecords[]>([]);
    const [userData, setUserData] = useState<UserWithPreferences | null>(null);
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [availableYears, setAvailableYears] = useState<number[]>([]);

    // Fetch user data including preferences and account ordering
    const fetchUserData = useCallback(async () => {
        try {
            const response = await userService.getUserData();
            if (response.success && response.data) {
                setUserData(response.data as UserWithPreferences);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error(t('dashboard.common.errors.dataLoadingError'));
        }
    }, [t]);

    // Fetch available years from the backend
    const fetchAvailableYears = useCallback(async () => {
        try {
            const response = await accountService.getAvailableYears();
            if (response.success && response.data) {
                setAvailableYears(response.data as unknown as number[]);
            }
        } catch (error) {
            console.error('Error fetching available years:', error);
            // Fallback to current year if there's an error
            setAvailableYears([new Date().getFullYear()]);
        }
    }, []);

    // Fetch accounts for the selected year
    const fetchAccountsByYear = useCallback(async (year: number, silent: boolean = false) => {
        try {
            if (!silent) setLoading(true);
            // Create a cache key for this year's data
            const cacheKey = `accounts_${year}`;
            
            // Check if we have cached data in sessionStorage
            const cachedData = sessionStorage.getItem(cacheKey);
            if (cachedData) {
                try {
                    const parsedData = JSON.parse(cachedData) as AccountWithYearRecords[];
                    if (!silent) setAccounts(parsedData);
                    if (!silent) setLoading(false);
                    
                    // Refresh in the background without blocking UI or showing loading
                    refreshAccountsInBackground(year, cacheKey);
                    return parsedData;
                } catch {
                    console.warn('Error parsing cached account data, fetching fresh data instead');
                    // Continue with fresh data fetch if cache parsing fails
                }
            }
            
            // No cache or cache error, fetch fresh data
            const response = await accountService.getAccountsByYear(year);
            if (response.success && response.data) {
                const rawAccountsData = response.data as AccountWithYearRecords[];

                // Transform API response format to component's expected format
                const transformedAccounts = rawAccountsData.map(account => {
                    const transformedAccount: AccountWithYearRecords = {
                        id: account.id,
                        user_id: account.user_id,
                        name: account.name,
                        background_color: account.background_color || account.configuration?.backgroundColor || '#cccccc',
                        text_color: account.text_color || account.configuration?.color || '#ffffff',
                        is_active: account.is_active !== undefined ? account.is_active : account.configuration?.isActive !== false,
                        account_order: account.account_order !== undefined ? account.account_order : account.accountOrder || 0,
                        created_at: account.created_at,
                        updated_at: account.updated_at,
                        deleted_at: account.deleted_at,
                        created_by: account.created_by,
                        updated_by: account.updated_by,
                        deleted_by: account.deleted_by
                    };

                    // Transform yearRecord to year_records array for compatibility
                    if (account.yearRecord) {
                        transformedAccount.year_records = [{
                            id: account.yearRecord.id || '',
                            account_id: account.yearRecord.account_id,
                            year: parseInt(year.toString()),
                            jan: account.yearRecord.jan,
                            feb: account.yearRecord.feb,
                            mar: account.yearRecord.mar,
                            apr: account.yearRecord.apr,
                            may: account.yearRecord.may,
                            jun: account.yearRecord.jun,
                            jul: account.yearRecord.jul,
                            aug: account.yearRecord.aug,
                            sep: account.yearRecord.sep,
                            oct: account.yearRecord.oct,
                            nov: account.yearRecord.nov,
                            dec: account.yearRecord.dec,
                            created_at: account.created_at,
                            updated_at: account.updated_at,
                            deleted_at: null,
                            created_by: account.created_by,
                            updated_by: account.updated_by,
                            deleted_by: null
                        }];
                    } else if (account.yearRecords) {
                        transformedAccount.year_records = Object.entries(account.yearRecords).map(([year, record]) => ({
                            id: record.id,
                            account_id: record.account_id,
                            year: parseInt(year),
                            jan: record.jan,
                            feb: record.feb,
                            mar: record.mar,
                            apr: record.apr,
                            may: record.may,
                            jun: record.jun,
                            jul: record.jul,
                            aug: record.aug,
                            sep: record.sep,
                            oct: record.oct,
                            nov: record.nov,
                            dec: record.dec,
                            created_at: record.created_at || account.created_at,
                            updated_at: record.updated_at || account.updated_at,
                            deleted_at: record.deleted_at || null,
                            created_by: record.created_by || account.created_by,
                            updated_by: record.updated_by || account.updated_by,
                            deleted_by: record.deleted_by || null
                        }));
                    } else if (account.year_records) {
                        transformedAccount.year_records = account.year_records;
                    }

                    return transformedAccount;
                });

                // Cache the transformed accounts for faster future loading
                try {
                    sessionStorage.setItem(cacheKey, JSON.stringify(transformedAccounts));
                    
                    // Also cache individual account data for direct access
                    transformedAccounts.forEach(account => {
                        try {
                            if (account.year_records) {
                                const yearRecord = account.year_records.find(record => record.year === year);
                                if (yearRecord) {
                                    const accountYearData = {
                                        id: account.id,
                                        name: account.name,
                                        yearRecord
                                    };
                                    sessionStorage.setItem(`account_${account.id}_year_${year}`, JSON.stringify(accountYearData));
                                }
                            }
                        } catch (e) {
                            console.warn('Error caching individual account data', e);
                        }
                    });
                } catch {
                    console.warn('Error caching account data');
                }

                if (!silent) setAccounts(transformedAccounts);
                if (!silent) setLoading(false);
                return transformedAccounts;
            } else {
                if (!silent) toast.error(t('dashboard.accounts.errors.loadingError'));
                if (!silent) setLoading(false);
                return [];
            }
        } catch (error) {
            console.error('Error fetching accounts:', error);
            if (!silent) toast.error(t('dashboard.accounts.errors.loadingError'));
            if (!silent) setLoading(false);
            return [];
        }
    }, [t]);

    // Function to refresh accounts data in the background without blocking UI
    const refreshAccountsInBackground = async (year: number, cacheKey: string) => {
        try {
            const response = await accountService.getAccountsByYear(year);
            if (response.success && response.data) {
                const rawAccountsData = response.data as AccountWithYearRecords[];

                // Transform API response format as in main function
                const transformedAccounts = rawAccountsData.map(account => {
                    const transformedAccount: AccountWithYearRecords = {
                        id: account.id,
                        user_id: account.user_id,
                        name: account.name,
                        background_color: account.background_color || account.configuration?.backgroundColor || '#cccccc',
                        text_color: account.text_color || account.configuration?.color || '#ffffff',
                        is_active: account.is_active !== undefined ? account.is_active : account.configuration?.isActive !== false,
                        account_order: account.account_order !== undefined ? account.account_order : account.accountOrder || 0,
                        created_at: account.created_at,
                        updated_at: account.updated_at,
                        deleted_at: account.deleted_at,
                        created_by: account.created_by,
                        updated_by: account.updated_by,
                        deleted_by: account.deleted_by
                    };

                    // Transform yearRecord to year_records array for compatibility
                    if (account.yearRecord) {
                        transformedAccount.year_records = [{
                            id: account.yearRecord.id || '',
                            account_id: account.yearRecord.account_id,
                            year: parseInt(year.toString()),
                            jan: account.yearRecord.jan,
                            feb: account.yearRecord.feb,
                            mar: account.yearRecord.mar,
                            apr: account.yearRecord.apr,
                            may: account.yearRecord.may,
                            jun: account.yearRecord.jun,
                            jul: account.yearRecord.jul,
                            aug: account.yearRecord.aug,
                            sep: account.yearRecord.sep,
                            oct: account.yearRecord.oct,
                            nov: account.yearRecord.nov,
                            dec: account.yearRecord.dec,
                            created_at: account.created_at,
                            updated_at: account.updated_at,
                            deleted_at: null,
                            created_by: account.created_by,
                            updated_by: account.updated_by,
                            deleted_by: null
                        }];
                    } else if (account.yearRecords) {
                        transformedAccount.year_records = Object.entries(account.yearRecords).map(([year, record]) => ({
                            id: record.id,
                            account_id: record.account_id,
                            year: parseInt(year),
                            jan: record.jan,
                            feb: record.feb,
                            mar: record.mar,
                            apr: record.apr,
                            may: record.may,
                            jun: record.jun,
                            jul: record.jul,
                            aug: record.aug,
                            sep: record.sep,
                            oct: record.oct,
                            nov: record.nov,
                            dec: record.dec,
                            created_at: record.created_at || account.created_at,
                            updated_at: record.updated_at || account.updated_at,
                            deleted_at: record.deleted_at || null,
                            created_by: record.created_by || account.created_by,
                            updated_by: record.updated_by || account.updated_by,
                            deleted_by: record.deleted_by || null
                        }));
                    } else if (account.year_records) {
                        transformedAccount.year_records = account.year_records;
                    }

                    return transformedAccount;
                });

                // Update cache with fresh data
                sessionStorage.setItem(cacheKey, JSON.stringify(transformedAccounts));
                
                // Also cache individual account data for direct access
                transformedAccounts.forEach(account => {
                    try {
                        if (account.year_records) {
                            const yearRecord = account.year_records.find(record => record.year === year);
                            if (yearRecord) {
                                const accountYearData = {
                                    id: account.id,
                                    name: account.name,
                                    yearRecord
                                };
                                sessionStorage.setItem(`account_${account.id}_year_${year}`, JSON.stringify(accountYearData));
                            }
                        }
                    } catch (e) {
                        console.warn('Error caching individual account data in background refresh', e);
                    }
                });
                
                // Update state without showing loading indicator
                setAccounts(transformedAccounts);
            }
        } catch (error) {
            console.error('Error refreshing accounts in background:', error);
            // Silent error - don't show toast for background refresh
        }
    };

    // Load initial data on component mount
    useEffect(() => {
        Promise.all([fetchUserData(), fetchAvailableYears()]);
    }, [fetchUserData, fetchAvailableYears]);

    // Effect to set the selectedYear after availableYears are loaded
    useEffect(() => {
        if (availableYears.length > 0 && !selectedYear) {
            // Get current year
            const currentYear = new Date().getFullYear();
            
            // Check if current year is in available years
            if (availableYears.includes(currentYear)) {
                setSelectedYear(currentYear.toString());
                // Pre-fetch current year data to have it ready for account forms
                fetchAccountsByYear(currentYear, true);
            } else {
                // Fall back to first available year if current year isn't available
                setSelectedYear(availableYears[0].toString());
                // Pre-fetch first year data
                fetchAccountsByYear(availableYears[0], true);
            }
        }
    }, [availableYears, selectedYear, fetchAccountsByYear]);

    // Fetch accounts when selected year changes
    useEffect(() => {
        if (selectedYear) {
            fetchAccountsByYear(parseInt(selectedYear));
        }
    }, [selectedYear, fetchAccountsByYear]);

    // Apply user's preferred account ordering
    const orderedAccounts = useMemo(() => {
        if (!userData?.accounts_order || !accounts.length) return accounts;

        const accountMap = new Map(accounts.map(acc => [acc.id, acc]));
        const orderedAccounts: AccountWithYearRecords[] = [];

        // First add accounts in the user's preferred order
        userData.accounts_order.forEach(id => {
            const account = accountMap.get(id);
            if (account) {
                orderedAccounts.push(account);
                accountMap.delete(id);
            }
        });

        // Then add any remaining accounts (e.g., newly created ones)
        accountMap.forEach(account => {
            orderedAccounts.push(account);
        });

        return orderedAccounts;
    }, [accounts, userData?.accounts_order]);

    // Handler for updating an existing account
    const handleAccountUpdate = async (updatedAccount: AccountWithYearRecords) => {
        try {
            // Create the basic update data object
            const updateData = {
                name: updatedAccount.name,
                background_color: updatedAccount.background_color,
                text_color: updatedAccount.text_color,
                is_active: updatedAccount.is_active,
                account_order: updatedAccount.account_order
            };
            
            // Check if we need to update year records
            if (updatedAccount.year_records && updatedAccount.year_records.length > 0) {
                // Convert the year_records array to the yearRecords object format the backend expects
                const yearRecordsData: Record<string, Record<string, number | null>> = {};
                
                updatedAccount.year_records.forEach(record => {
                    if (record.year) {
                        // Convert number to string for object key
                        const yearKey = String(record.year);
                        yearRecordsData[yearKey] = {
                            jan: record.jan,
                            feb: record.feb,
                            mar: record.mar,
                            apr: record.apr,
                            may: record.may,
                            jun: record.jun,
                            jul: record.jul,
                            aug: record.aug,
                            sep: record.sep,
                            oct: record.oct,
                            nov: record.nov,
                            dec: record.dec
                        };
                    }
                });
                
                // Add yearRecords to the request payload
                Object.assign(updateData, { yearRecords: yearRecordsData });
            }
            
            // Send the update request
            const response = await accountService.updateAccount(updatedAccount.id, updateData);

            if (response.success) {
                // Clear related caches to ensure data is refreshed
                try {
                    // Clear account years cache
                    const accountYearsCacheKey = `account_${updatedAccount.id}_available_years`;
                    sessionStorage.removeItem(accountYearsCacheKey);
                    
                    // Clear specific year caches for this account
                    if (updatedAccount.year_records) {
                        updatedAccount.year_records.forEach(record => {
                            if (record.year) {
                                const yearCacheKey = `account_${updatedAccount.id}_year_${record.year}`;
                                sessionStorage.removeItem(yearCacheKey);
                            }
                        });
                    }
                    
                    // Clear the accounts cache for selected year
                    const accountsCacheKey = `accounts_${selectedYear}`;
                    sessionStorage.removeItem(accountsCacheKey);
                } catch (e) {
                    console.warn('Error clearing caches during account update', e);
                }
                
                // Refresh the accounts data
                await fetchAccountsByYear(parseInt(selectedYear));
                toast.success(t('dashboard.accounts.success.accountUpdated'));
                return true;
            } else {
                toast.error(t('dashboard.accounts.errors.updateError'));
                return false;
            }
        } catch (error) {
            console.error('❌ Error updating account:', error);
            toast.error(t('dashboard.accounts.errors.updateError'));
            return false;
        }
    };

    // Handler for creating a new account
    const handleAccountCreate = async (newAccount: AccountWithYearRecords): Promise<boolean> => {
        try {
            const response = await accountService.createAccount({
                name: newAccount.name,
                background_color: newAccount.background_color,
                text_color: newAccount.text_color,
                is_active: newAccount.is_active,
                account_order: newAccount.account_order
            });

            if (response.success && response.data) {
                // Refresh the accounts data
                await fetchAccountsByYear(parseInt(selectedYear));
                toast.success(t('dashboard.accounts.success.accountCreated'));
                return true;
            } else {
                toast.error(t('dashboard.accounts.errors.createError'));
                return false;
            }
        } catch (error) {
            console.error('❌ Error creating account:', error);
            toast.error(t('dashboard.accounts.errors.createError'));
            return false;
        }
    };

    // Handler for deleting an account
    const handleAccountDelete = async (accountId: UUID): Promise<boolean> => {
        try {
            const response = await accountService.deleteAccount(accountId);

            if (response.success) {
                // Refresh the accounts data
                await fetchAccountsByYear(parseInt(selectedYear));
                toast.success(t('dashboard.accounts.success.accountDeleted'));
                return true;
            } else {
                toast.error(t('dashboard.accounts.errors.deleteError'));
                return false;
            }
        } catch (error) {
            console.error('❌ Error deleting account:', error);
            toast.error(t('dashboard.accounts.errors.deleteError'));
            return false;
        }
    };

    // Handler for changing the order of accounts (drag and drop)
    const handleOrderChange = async (newOrder: UUID[]) => {
        try {
            const response = await accountService.updateAccountsOrder(newOrder);
            if (response.success) {
                setUserData(prev => prev ? {
                    ...prev,
                    accounts_order: newOrder
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

    // Separate active and inactive accounts for display
    const { activeAccounts, inactiveAccounts } = useMemo(() => {
        return {
            activeAccounts: orderedAccounts.filter(account => account.is_active !== false),
            inactiveAccounts: orderedAccounts.filter(account => account.is_active === false)
        };
    }, [orderedAccounts]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%'
        }}>
            {/* Year selection dropdown */}
            <Paper elevation={2} sx={{
                p: 1,
                borderRadius: 3,
                width: '100%'
            }}>
                <FormControl size="small" fullWidth sx={{ minWidth: 120 }}>
                    <InputLabel>{t('dashboard.common.year')}</InputLabel>
                    <Select
                        value={selectedYear}
                        label={t('dashboard.common.year')}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        disabled={availableYears.length === 0}
                    >
                        {availableYears.map(year => (
                            <MenuItem key={year} value={year.toString()}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>

            {/* Monthly balances chart */}
            <Paper elevation={2} sx={{
                p: 2,
                borderRadius: 3,
                width: '100%',
                height: '400px'
            }}>
                <AccountsChart
                    accounts={activeAccounts}
                    loading={loading}
                    selectedYear={Number(selectedYear)}
                />
            </Paper>

            {/* Accounts management table/list */}
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
    );
} 