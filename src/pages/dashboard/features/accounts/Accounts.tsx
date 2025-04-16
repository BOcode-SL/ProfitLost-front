/**
 * Accounts Module
 * 
 * Main interface for financial account management with data visualization and CRUD operations.
 * 
 * Features:
 * - Manages financial accounts display with current balances
 * - Handles year-based data retrieval and visualization
 * - Provides account creation, editing, and deletion capabilities
 * - Implements account ordering and active/inactive account management
 * - Optimizes data loading with caching for better performance
 * - Handles error states with appropriate user feedback
 * - Displays monthly balances in chart visualization
 * 
 * @module Accounts
 */
import { useMemo, useState, useEffect, useCallback } from 'react';
import { Box, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// Services
import { accountService } from '../../../../services/account.service';
import { userService } from '../../../../services/user.service';

// Types
import type { Account } from '../../../../types/supabase/accounts';
import type { YearRecord } from '../../../../types/supabase/year_records';
import type { User } from '../../../../types/supabase/users';
import type { UUID } from '../../../../types/supabase/common';

/**
 * Extended Account interface with year_records relationship and additional properties
 * Used to manage accounts with their financial data across different years
 * 
 * @interface AccountWithYearRecords
 * @extends {Account}
 */
interface AccountWithYearRecords extends Account {
    /** Annual financial data records for the account */
    year_records?: YearRecord[];
    
    /** Year records in an object format, keyed by year */
    yearRecords?: Record<string, YearRecord>;
    
    /** Financial record for the currently selected year */
    yearRecord?: YearRecord;
    
    /** Visual and status configuration for the account */
    configuration?: {
        backgroundColor: string;
        color: string;
        isActive: boolean;
    };
    
    /** Position in the displayed account list */
    accountOrder?: number;
}

/**
 * User interface extended with account ordering preferences
 * Stores user customization for account display order
 * 
 * @interface UserWithPreferences
 * @extends {User}
 */
interface UserWithPreferences extends User {
    /** User-defined ordering of accounts by their IDs */
    accounts_order?: UUID[];
}

// Components
import AccountsChart from './components/AccountsChart';
import AccountsTable from './components/AccountsTable';

/**
 * Accounts Component
 * 
 * Main container for the Accounts section that manages all account data,
 * state, and user interactions.
 * 
 * @returns {JSX.Element} The rendered Accounts component
 */
export default function Accounts() {
    const { t } = useTranslation();

    // State management
    const [loading, setLoading] = useState(true);
    const [accounts, setAccounts] = useState<AccountWithYearRecords[]>([]);
    const [userData, setUserData] = useState<UserWithPreferences | null>(null);
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [availableYears, setAvailableYears] = useState<number[]>([]);

    /**
     * Fetches user data including preferences and account ordering
     * Retrieves the user's preferred display order for accounts
     */
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

    /**
     * Fetches available years for account data
     * Used to populate the year selector dropdown
     */
    const fetchAvailableYears = useCallback(async () => {
        try {
            const response = await accountService.getAvailableYears();
            if (response.success && response.data) {
                const years = response.data as unknown as number[];
                setAvailableYears(years);
            }
        } catch (error) {
            console.error('Error fetching available years:', error);
            // Fallback to current year if fetching fails
            setAvailableYears([new Date().getFullYear()]);
        }
    }, []);

    /**
     * Fetches accounts data for the selected year
     * Transforms API data to component's expected format
     * 
     * @param {number} year - The year to fetch accounts for
     * @param {boolean} [silent=false] - Whether to show loading indicators
     * @returns {Promise<AccountWithYearRecords[]>} The fetched accounts
     */
    const fetchAccountsByYear = useCallback(async (year: number, silent: boolean = false) => {
        try {
            if (!silent) setLoading(true);
            
            const response = await accountService.getAccountsByYear(year);
            if (response.success && response.data) {
                const rawAccountsData = response.data as AccountWithYearRecords[];

                // Transform API response to component's expected format
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

                    // Handle different data formats for year records
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

    /**
     * Loads initial data on component mount
     * Fetches user preferences and available years
     */
    useEffect(() => {
        Promise.all([fetchUserData(), fetchAvailableYears()]);
    }, [fetchUserData, fetchAvailableYears]);

    /**
     * Sets the selected year after available years are loaded
     * Defaults to current year or first available year
     */
    useEffect(() => {
        if (availableYears.length > 0 && !selectedYear) {
            const currentYear = new Date().getFullYear();
            
            if (availableYears.includes(currentYear)) {
                setSelectedYear(currentYear.toString());
                fetchAccountsByYear(currentYear, true);
            } else {
                setSelectedYear(availableYears[0].toString());
                fetchAccountsByYear(availableYears[0], true);
            }
        }
    }, [availableYears, selectedYear, fetchAccountsByYear]);

    /**
     * Fetches accounts when selected year changes
     */
    useEffect(() => {
        if (selectedYear) {
            fetchAccountsByYear(parseInt(selectedYear));
        }
    }, [selectedYear, fetchAccountsByYear]);

    /**
     * Orders accounts based on user preferences
     * Creates a sorted account list using the user's custom order
     */
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

    /**
     * Updates an existing account with new data
     * 
     * @param {AccountWithYearRecords} updatedAccount - The account to update
     * @returns {Promise<boolean>} Success indicator
     */
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
            
            // Prepare year records data if present
            if (updatedAccount.year_records && updatedAccount.year_records.length > 0) {
                const yearRecordsData: Record<string, Record<string, number | null>> = {};
                
                updatedAccount.year_records.forEach(record => {
                    if (record.year) {
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
                
                Object.assign(updateData, { yearRecords: yearRecordsData });
            }
            
            // Send the update request
            const response = await accountService.updateAccount(updatedAccount.id, updateData);

            if (response.success) {
                await fetchAvailableYears();
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

    /**
     * Creates a new account
     * 
     * @param {AccountWithYearRecords} newAccount - The account to create
     * @returns {Promise<boolean>} Success indicator
     */
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
                await fetchAvailableYears();
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

    /**
     * Deletes an account by ID
     * 
     * @param {UUID} accountId - ID of the account to delete
     * @returns {Promise<boolean>} Success indicator
     */
    const handleAccountDelete = async (accountId: UUID): Promise<boolean> => {
        try {
            const response = await accountService.deleteAccount(accountId);

            if (response.success) {
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

    /**
     * Updates the display order of accounts
     * Saves the new order to user preferences
     * 
     * @param {UUID[]} newOrder - New order of account IDs
     */
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

    /**
     * Separates active and inactive accounts for display
     * Used to show inactive accounts in a separate collapsible section
     */
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