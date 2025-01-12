import { Box, Paper, Typography, Button, Drawer } from '@mui/material';
import { Fade } from '@mui/material';
import { useState, useMemo } from 'react';
import AccountsForm from './AccountsForm';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import { useUser } from '../../../../../contexts/UserContext';
import type { Account } from '../../../../../types/models/account.modelTypes';
import { accountService } from '../../../../../services/account.service';

interface AccountsTableProps {
    accounts: Account[];
    loading: boolean;
    selectedYear: number;
    onReorder: (accounts: Account[]) => void;
}

export default function AccountsTable({ accounts, selectedYear, onReorder }: AccountsTableProps) {
    const { user } = useUser();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    const currentMonth = useMemo(() => {
        const date = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[date.getMonth()];
    }, []);

    const getAccountBalance = (account: Account): number => {
        const currentRecord = account.records.find(
            record => record.year === selectedYear && record.month === currentMonth
        );
        return currentRecord?.value || 0;
    };

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, accountId: string) => {
        event.stopPropagation();
        event.dataTransfer.setData('text/plain', accountId);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetAccountId: string) => {
        event.preventDefault();
        const draggedAccountId = event.dataTransfer.getData('text/plain');

        if (draggedAccountId && draggedAccountId !== targetAccountId) {
            const draggedIndex = accounts.findIndex(acc => acc._id === draggedAccountId);
            const targetIndex = accounts.findIndex(acc => acc._id === targetAccountId);

            const newAccounts = [...accounts];
            const [draggedAccount] = newAccounts.splice(draggedIndex, 1);
            newAccounts.splice(targetIndex, 0, draggedAccount);

            onReorder(newAccounts);
        }
    };

    const handleAddAccountSuccess = async () => {
        try {
            const response = await accountService.getAccountsByYear(selectedYear);
            if (response.success && response.data) {
                const accountsData = Array.isArray(response.data) ? response.data : [response.data];
                onReorder(accountsData);
            }
        } catch (error) {
            console.error('Error refreshing accounts:', error);
        }
    };

    const handleAccountClick = (account: Account) => {
        setSelectedAccount(account);
        setIsDrawerOpen(true);
    };

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
                        sx={{
                            px: 2,
                            py: 1,
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            height: '35px'
                        }}
                    >
                        New Account
                    </Button>
                </Box>

                <Drawer
                    open={isDrawerOpen}
                    onClose={() => {
                        setIsDrawerOpen(false);
                        setSelectedAccount(null);
                    }}
                    anchor="right"
                    PaperProps={{
                        sx: {
                            width: { xs: '100%', sm: 450 },
                            bgcolor: 'background.default'
                        }
                    }}
                >
                    <AccountsForm 
                        onClose={() => {
                            setIsDrawerOpen(false);
                            setSelectedAccount(null);
                        }} 
                        onSuccess={handleAddAccountSuccess}
                        account={selectedAccount}
                    />
                </Drawer>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {accounts.map((account) => (
                        <Paper
                            key={account._id}
                            onClick={() => handleAccountClick(account)}
                            draggable
                            onDragStart={(e) => handleDragStart(e, account._id)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, account._id)}
                            elevation={0}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                p: 2,
                                borderRadius: 3,
                                cursor: 'grab',
                                height: '64px',
                                transition: 'all 0.2s ease',
                                backgroundColor: account.configuration.backgroundColor,
                                color: account.configuration.color,
                                opacity: account.configuration.isActive ? 1 : 0.5,
                                '&:hover': {
                                    opacity: 0.8
                                },
                                '&:active': {
                                    cursor: 'grabbing'
                                }
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                flex: 1
                            }}>
                                <span className="material-symbols-rounded">drag_indicator</span>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 500,
                                        fontSize: '1.2rem'
                                    }}
                                >
                                    {account.accountName}
                                </Typography>
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    textAlign: 'right',
                                    fontSize: '1.3rem',
                                    fontWeight: 500
                                }}
                            >
                                {formatCurrency(getAccountBalance(account), user)}
                            </Typography>
                        </Paper>
                    ))}
                </Box>
            </Paper>
        </Fade>
    );
} 