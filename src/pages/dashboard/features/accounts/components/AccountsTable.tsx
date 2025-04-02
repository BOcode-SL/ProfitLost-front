/**
 * AccountsTable Component
 * 
 * Displays a list of accounts with their current balances in a clean, interactive UI.
 * Features include:
 * - Draggable account cards for custom ordering
 * - Search filtering for quick account lookup
 * - Toggle for showing/hiding inactive accounts
 * - Currency visibility respecting user privacy preferences
 * - Creation, editing, and deletion of accounts via drawer form
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
import type { Account, YearRecord } from '../../../../../types/models/account';

// Utils
import { formatCurrency, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../../../utils/currencyUtils';

// Components
import AccountsForm from './AccountsForm';
import DrawerBase from '../../../components/ui/DrawerBase';

// Interface for the props of the AccountsTable component
interface AccountsTableProps {
    accounts: Account[]; // List of active accounts
    inactiveAccounts: Account[]; // List of inactive accounts
    loading: boolean; // Indicator for loading state
    selectedYear: number; // The year currently selected
    onUpdate: (account: Account) => Promise<boolean>; // Function to update an account
    onCreate: (account: Account) => Promise<boolean>; // Function to create a new account
    onDelete: (accountId: string) => void; // Function to delete an account by its ID
    onOrderChange: (newOrder: string[]) => void; // Function to change the order of accounts
}

// AccountsTable component for displaying and managing accounts
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
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [draggedAccountId, setDraggedAccountId] = useState<string | null>(null);
    const [showInactiveAccounts, setShowInactiveAccounts] = useState(false);
    const [isHidden, setIsHidden] = useState(isCurrencyHidden());
    const [searchTerm, setSearchTerm] = useState('');

    // Effect to listen for currency visibility changes app-wide
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

    // Function to get the current month's balance for an account
    const getCurrentBalance = (account: Account): number => {
        const currentMonth = new Date().toLocaleString('en-US', { month: 'short' }).toLowerCase();
        const yearRecord = account.records[selectedYear.toString()];
        return yearRecord ? yearRecord[currentMonth as keyof YearRecord] : 0;
    };

    // Drag and drop handlers for account reordering
    const handleDragStart = (accountId: string) => {
        setDraggedAccountId(accountId);
    };

    const handleDrop = (targetAccountId: string) => {
        if (draggedAccountId && draggedAccountId !== targetAccountId) {
            const draggedIndex = accounts.findIndex(acc => acc._id === draggedAccountId);
            const targetIndex = accounts.findIndex(acc => acc._id === targetAccountId);
            const updatedAccounts = [...accounts];
            const [draggedAccount] = updatedAccounts.splice(draggedIndex, 1);
            updatedAccounts.splice(targetIndex, 0, draggedAccount);

            onOrderChange(updatedAccounts.map(acc => acc._id));
        }
        setDraggedAccountId(null);
    };

    // Filter accounts based on search term
    const filteredAccounts = accounts.filter(account =>
        account.accountName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredInactiveAccounts = inactiveAccounts.filter(account =>
        account.accountName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Renderer function for account cards (active and inactive)
    const renderAccount = (account: Account, isInactive: boolean = false) => (
        // Card component for the account with appropriate styling
        <Paper
            key={account._id}
            onClick={() => {
                setSelectedAccount(account);
                setIsDrawerOpen(true);
            }}
            onDragStart={() => !isInactive && handleDragStart(account._id)}
            onDragOver={(e) => !isInactive && e.preventDefault()}
            onDrop={() => !isInactive && handleDrop(account._id)}
            draggable={!isInactive}
            elevation={0}
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                borderRadius: 3,
                cursor: 'pointer',
                backgroundColor: account.configuration.backgroundColor,
                color: account.configuration.color,
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
                <Typography variant="h6" sx={{ color: account.configuration.color }}>
                    {account.accountName}
                </Typography>
            </Box>
            {/* Account balance display with currency hiding support */}
            <Typography
                variant="body1"
                sx={{
                    color: account.configuration.color,
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
                    onClick={() => setIsDrawerOpen(true)}
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
            </DrawerBase>
        </Paper>
    );
} 