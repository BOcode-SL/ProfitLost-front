import { useState } from 'react';
import { Box, Paper, Typography, Button, Drawer, Collapse, Fade, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useUser } from '../../../../../contexts/UserContext';
import type { Account } from '../../../../../types/models/account';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import AccountsForm from './AccountsForm';

interface AccountsTableProps {
    accounts: Account[];
    inactiveAccounts: Account[];
    loading: boolean;
    selectedYear: number;
    onUpdate: (account: Account) => Promise<boolean>;
    onCreate: (account: Account) => Promise<boolean>;
    onDelete: (accountId: string) => void;
    onOrderChange: (newOrder: string[]) => void;
}

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
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [draggedAccountId, setDraggedAccountId] = useState<string | null>(null);
    const [showInactiveAccounts, setShowInactiveAccounts] = useState(false);
    const { t } = useTranslation();

    const getCurrentBalance = (account: Account): number => {
        const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
        const record = account.records.find(r =>
            r.year === selectedYear && r.month === currentMonth
        );
        return record?.value || 0;
    };

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

    const renderAccount = (account: Account, isInactive: boolean = false) => (
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {!isInactive && (
                    <span
                        className="material-symbols-rounded"
                        style={{
                            cursor: 'grab',
                            fontSize: '20px',
                            opacity: 0.7
                        }}
                    >
                        drag_indicator
                    </span>
                )}
                <Typography variant="h6" sx={{ color: account.configuration.color }}>
                    {account.accountName}
                </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: account.configuration.color }}>
                {formatCurrency(getCurrentBalance(account), user)}
            </Typography>
        </Paper>
    );

    return (
        <Fade in timeout={400}>
            <Paper sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                p: 3,
                borderRadius: 3
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mb: 2
                }}>
                    <Button
                        variant="contained"
                        onClick={() => setIsDrawerOpen(true)}
                        startIcon={<span className="material-symbols-rounded">add</span>}
                        size="small"
                    >
                        {t('dashboard.accounts.newAccount')}
                    </Button>
                </Box>

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
                        {accounts.map(account => renderAccount(account))}
                        
                        {accounts.length === 0 && (
                            <Fade in timeout={300}>
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
                            </Fade>
                        )}

                        {inactiveAccounts.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    onClick={() => setShowInactiveAccounts(!showInactiveAccounts)}
                                    startIcon={
                                        <span className="material-symbols-rounded">
                                            {showInactiveAccounts ? 'expand_less' : 'expand_more'}
                                        </span>
                                    }
                                    sx={{ mb: 1, color: 'text.primary' }}
                                >
                                    {t('dashboard.accounts.table.inactiveAccounts')} ({inactiveAccounts.length})
                                </Button>
                                <Collapse in={showInactiveAccounts}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {inactiveAccounts.map(account => renderAccount(account, true))}
                                    </Box>
                                </Collapse>
                            </Box>
                        )}
                    </Box>
                )}

                <Drawer
                    open={isDrawerOpen}
                    onClose={() => {
                        setIsDrawerOpen(false);
                        setSelectedAccount(null);
                    }}
                    anchor="right"
                    PaperProps={{
                        sx: {
                            width: { xs: '100%', sm: 450 }
                        }
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
                </Drawer>
            </Paper>
        </Fade>
    );
} 