/**
 * AccountsTable Module
 * 
 * Provides a comprehensive interface for managing financial accounts.
 * 
 * Responsibilities:
 * - Displays active and inactive accounts with their current balances
 * - Enables account reordering through drag and drop functionality
 * - Supports filtering accounts by search term
 * - Manages visibility toggle for inactive accounts
 * - Respects privacy settings for currency display
 * - Facilitates account creation, editing, and deletion workflows
 * - Optimizes data loading with background refreshes and caching
 * 
 * @module AccountsTable
 */
import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Collapse, CircularProgress, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Types
import type { Account } from '../../../../../types/supabase/accounts';
import type { YearRecord } from '../../../../../types/supabase/year_records';
import type { UUID } from '../../../../../types/supabase/common';

// Utils
import { formatCurrency, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../../../utils/currencyUtils';

// Components
import AccountsForm from './AccountsForm';
import DrawerBase from '../../../components/ui/DrawerBase';

// Services
import { accountService } from '../../../../../services/account.service';

/**
 * Extended Account interface that includes year_records relationship
 * 
 * @interface AccountWithYearRecords
 * @extends {Account}
 */
interface AccountWithYearRecords extends Account {
    /** Records of annual financial data for this account */
    year_records?: YearRecord[];
}

/**
 * Interface for the props of the AccountsTable component
 * 
 * @interface AccountsTableProps
 */
interface AccountsTableProps {
    /** List of active accounts */
    accounts: AccountWithYearRecords[];
    
    /** List of inactive accounts */
    inactiveAccounts: AccountWithYearRecords[];
    
    /** Indicator for loading state */
    loading: boolean;
    
    /** The year currently selected */
    selectedYear: number;
    
    /** Function to update an account */
    onUpdate: (account: AccountWithYearRecords) => Promise<boolean>;
    
    /** Function to create a new account */
    onCreate: (account: AccountWithYearRecords) => Promise<boolean>;
    
    /** Function to delete an account by its ID */
    onDelete: (accountId: UUID) => void;
    
    /** Function to change the order of accounts */
    onOrderChange: (newOrder: UUID[]) => void;
}

/**
 * AccountsTable Component
 * 
 * Displays and manages accounts with their balances, providing UI for
 * account creation, modification, deletion, and order customization.
 * 
 * @param {AccountsTableProps} props - The component props
 * @returns {JSX.Element} The rendered AccountsTable component
 */
export default function AccountsTable({
    accounts,
    inactiveAccounts,
    loading,
    selectedYear,
    onUpdate,
    onCreate,
    onDelete,
    onOrderChange
}: AccountsTableProps) {
    const { user } = useUser();
    const { t } = useTranslation();

    // Component state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<AccountWithYearRecords | null>(null);
    const [draggedAccountId, setDraggedAccountId] = useState<UUID | null>(null);
    const [showInactiveAccounts, setShowInactiveAccounts] = useState(false);
    const [isHidden, setIsHidden] = useState(isCurrencyHidden());
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoadingAccount, setIsLoadingAccount] = useState(false);

    /**
     * Effect to listen for currency visibility changes app-wide
     * Updates component state when visibility setting changes
     */
    useEffect(() => {
        const handleVisibilityChange = (event: Event) => {
            const customEvent = event as CustomEvent;
            setIsHidden(customEvent.detail.isHidden);
        };

        window.addEventListener(CURRENCY_VISIBILITY_EVENT, handleVisibilityChange);
        return () => {
            window.removeEventListener(CURRENCY_VISIBILITY_EVENT, handleVisibilityChange);
        };
    }, []);

    /**
     * Gets the current month's balance for an account
     * 
     * @param {AccountWithYearRecords} account - The account to get balance for
     * @returns {number} The current month's balance
     */
    const getCurrentBalance = (account: AccountWithYearRecords): number => {
        const currentMonth = new Date().toLocaleString('en-US', { month: 'short' }).toLowerCase();
        
        // Find year record for the selected year
        const yearRecord = account.year_records?.find(record => record.year === selectedYear);
        if (!yearRecord) return 0;
        
        // Get the value for the current month
        const monthKey = currentMonth as keyof YearRecord;
        const value = yearRecord[monthKey] as string | null;
        
        // Convert to number
        return value ? parseFloat(value) : 0;
    };

    /**
     * Initiates drag operation for account reordering
     * 
     * @param {UUID} accountId - ID of the account being dragged
     */
    const handleDragStart = (accountId: UUID) => {
        setDraggedAccountId(accountId);
    };

    /**
     * Handles drop event to complete account reordering
     * Calculates new account order and triggers update
     * 
     * @param {UUID} targetAccountId - ID of the target account where dragged account is dropped
     */
    const handleDrop = (targetAccountId: UUID) => {
        if (draggedAccountId && draggedAccountId !== targetAccountId) {
            const draggedIndex = accounts.findIndex(acc => acc.id === draggedAccountId);
            const targetIndex = accounts.findIndex(acc => acc.id === targetAccountId);
            const updatedAccounts = [...accounts];
            const [draggedAccount] = updatedAccounts.splice(draggedIndex, 1);
            updatedAccounts.splice(targetIndex, 0, draggedAccount);

            onOrderChange(updatedAccounts.map(acc => acc.id));
        }
        setDraggedAccountId(null);
    };

    // Filter accounts based on search term
    const filteredAccounts = accounts.filter(account =>
        account.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredInactiveAccounts = inactiveAccounts.filter(account =>
        account.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    /**
     * Fetches complete account details when an account is selected
     * Uses optimized loading with cache for better performance
     * 
     * @param {UUID} accountId - ID of the account to load details for
     */
    const fetchAccountDetails = async (accountId: UUID) => {
        setIsLoadingAccount(true);
        try {
            // Get current year for optimized data loading
            const currentYear = new Date().getFullYear();
            
            // First check if we already have full account data in our existing accounts
            const existingAccount = [...accounts, ...inactiveAccounts].find(acc => acc.id === accountId);
            
            // If we have year_records data for this account with current year data, use it directly without API call
            if (existingAccount && existingAccount.year_records && 
                existingAccount.year_records.some(record => record.year === currentYear)) {
                setSelectedAccount(existingAccount);
                setIsDrawerOpen(true);
                setIsLoadingAccount(false);
                return;
            }
            
            // Only make API call if necessary - specifically request current year data
            const response = await accountService.getAccountDetailById(accountId, currentYear);
            if (response.success && response.data) {
                setSelectedAccount(response.data as AccountWithYearRecords);
                setIsDrawerOpen(true);
            } else {
                // If API fails, fall back to the basic account data
                setSelectedAccount(existingAccount || null);
                setIsDrawerOpen(true);
            }
        } catch (error) {
            console.error('Error fetching account details:', error);
            // Fall back to the basic account data on error
            const basicAccount = [...accounts, ...inactiveAccounts].find(acc => acc.id === accountId) || null;
            setSelectedAccount(basicAccount);
            setIsDrawerOpen(true);
        } finally {
            setIsLoadingAccount(false);
        }
    };

    /**
     * Renders an account card with appropriate styling and handlers
     * 
     * @param {AccountWithYearRecords} account - The account to render
     * @param {boolean} [isInactive=false] - Whether this is an inactive account
     * @returns {JSX.Element} The rendered account card
     */
    const renderAccount = (account: AccountWithYearRecords, isInactive: boolean = false) => (
        // Card component for the account with appropriate styling
        <Paper
            key={account.id}
            onClick={() => {
                fetchAccountDetails(account.id);
            }}
            onDragStart={() => !isInactive && handleDragStart(account.id)}
            onDragOver={(e) => !isInactive && e.preventDefault()}
            onDrop={() => !isInactive && handleDrop(account.id)}
            draggable={!isInactive}
            elevation={0}
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                borderRadius: 3,
                cursor: 'pointer',
                backgroundColor: account.background_color,
                color: account.text_color,
                opacity: isInactive ? 0.7 : 1
            }}
        >
            {/* Account name with optional drag handle */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Drag indicator only shown for active accounts */}
                {!isInactive && (
                    <DragIndicatorIcon
                        sx={{
                            cursor: 'grab',
                            fontSize: '20px',
                            opacity: 0.7
                        }}
                    />
                )}
                {/* Account name display */}
                <Typography variant="h6" sx={{ color: account.text_color }}>
                    {account.name}
                </Typography>
            </Box>
            {/* Account balance display with currency hiding support */}
            <Typography
                variant="body1"
                sx={{
                    color: account.text_color,
                    filter: isHidden ? 'blur(8px)' : 'none',
                    transition: 'filter 0.3s ease',
                    userSelect: isHidden ? 'none' : 'auto',
                    fontSize: { xs: '1rem', sm: '1.2rem' }
                }}
            >
                {formatCurrency(getCurrentBalance(account), user)}
            </Typography>
        </Paper>
    );

    return (
        <Paper sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            p: 3,
            borderRadius: 3
        }}>
            {/* Table header with search and create account button */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexDirection: { xs: 'column-reverse', sm: 'row' },
                gap: 2,
                mb: 2
            }}>
                <TextField
                    size="small"
                    placeholder={t('dashboard.accounts.table.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        minWidth: { xs: '100%', sm: 200 },
                        '& .MuiInputBase-root': {
                            height: '35px'
                        }
                    }}
                />
                <Button
                    variant="contained"
                    onClick={() => {
                        setSelectedAccount(null);
                        setIsDrawerOpen(true);
                    }}
                    startIcon={<AddIcon />}
                    size="small"
                    sx={{
                        width: { xs: '100%', sm: 'auto' }
                    }}
                >
                    {t('dashboard.accounts.newAccount')}
                </Button>
            </Box>

            {/* Loading indicator shown while fetching data */}
            {loading ? (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 200
                }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {/* List of active accounts, filtered by search term */}
                    {filteredAccounts.map(account => renderAccount(account))}

                    {/* Empty state messages for no accounts or no search results */}
                    {accounts.length === 0 ? (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: 3,
                            minHeight: 200
                        }}>
                            <Typography variant="h5" color="text.secondary">
                                {t('dashboard.accounts.table.addAccountBanner')}
                            </Typography>
                        </Box>
                    ) : filteredAccounts.length === 0 && searchTerm !== '' ? (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: 3,
                            minHeight: 200
                        }}>
                            <Typography variant="h5" color="text.secondary">
                                🔍 {t('dashboard.accounts.table.noAccountsFound')} "{searchTerm}" 🔍
                            </Typography>
                        </Box>
                    ) : null}

                    {/* Collapsible section for inactive accounts */}
                    {filteredInactiveAccounts.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Button
                                onClick={() => setShowInactiveAccounts(!showInactiveAccounts)}
                                startIcon={showInactiveAccounts ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                sx={{ mb: 1, color: 'text.primary' }}
                            >
                                {t('dashboard.accounts.table.inactiveAccounts')} ({filteredInactiveAccounts.length})
                            </Button>
                            <Collapse in={showInactiveAccounts}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {filteredInactiveAccounts.map(account => renderAccount(account, true))}
                                </Box>
                            </Collapse>
                        </Box>
                    )}
                </Box>
            )}

            {/* Drawer with account form for creating/editing */}
            <DrawerBase
                open={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false);
                    setSelectedAccount(null);
                }}
            >
                {isLoadingAccount ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <AccountsForm
                        onClose={() => {
                            setIsDrawerOpen(false);
                            setSelectedAccount(null);
                        }}
                        onSuccess={async (account) => {
                            if (selectedAccount) {
                                await onUpdate(account);
                            } else {
                                await onCreate(account);
                            }
                            setIsDrawerOpen(false);
                            setSelectedAccount(null);
                            return true;
                        }}
                        onDelete={onDelete}
                        account={selectedAccount}
                    />
                )}
            </DrawerBase>
        </Paper>
    );
} 