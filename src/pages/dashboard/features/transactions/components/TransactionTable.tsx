import { useState, useCallback } from 'react';
import { Box, Paper, TextField, Select, MenuItem, Typography, CircularProgress, Drawer, Button, FormControl, InputLabel, Fade, useTheme } from '@mui/material';

import { useUser } from '../../../../../contexts/UserContext';
import type { Transaction } from '../../../../../types/models/transaction';
import type { Category } from '../../../../../types/models/category';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import { formatDateTime } from '../../../../../utils/dateUtils';
import TransactionForm from './TransactionForm';

interface TransactionTableProps {
    data: Transaction[];
    loading: boolean;
    categories: Category[];
    onReload: () => void;
}

export default function TransactionTable({
    data,
    loading,
    categories,
    onReload
}: TransactionTableProps) {
    const { user } = useUser();
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState<string>('date_desc');
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);
    const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [hoveredTransactionId, setHoveredTransactionId] = useState<string | null>(null);

    const handleTransactionClick = useCallback((transaction: Transaction) => {
        setCreateDrawerOpen(false);
        setEditDrawerOpen(false);

        setSelectedTransaction(null);

        requestAnimationFrame(() => {
            setSelectedTransaction(transaction);
            setEditDrawerOpen(true);
        });
    }, []);

    const handleCloseEditDrawer = useCallback(() => {
        setEditDrawerOpen(false);
        setTimeout(() => {
            setSelectedTransaction(null);
        }, 300);
    }, []);

    const handleCreateClick = useCallback(() => {
        setSelectedTransaction(null);
        setCreateDrawerOpen(true);
    }, []);

    const getCategoryColor = (categoryName: string) => {
        const category = categories.find(cat => cat.name === categoryName);
        return category?.color || theme.palette.grey[500];
    };

    // Filter and sort transactions
    const filteredAndSortedTransactions = data
        .filter(transaction => {
            const searchLower = searchTerm.toLowerCase();
            return transaction.description.toLowerCase().includes(searchLower) ||
                transaction.amount.toString().includes(searchTerm);
        })
        .sort((a, b) => {
            switch (sortOption) {
                case 'date_desc':
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'date_asc':
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'amount_desc':
                    return b.amount - a.amount;
                case 'amount_asc':
                    return a.amount - b.amount;
                default:
                    return 0;
            }
        });

    return (
        <Box sx={{ width: '100%' }}>
            <Fade in timeout={400}>
                <Paper
                    elevation={2}
                    sx={{
                        p: 1,
                        borderRadius: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        flexWrap: { xs: 'wrap', sm: 'nowrap' }
                    }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            p: 2,
                        }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'end',
                                flexDirection: { xs: 'column-reverse', sm: 'row' },
                                gap: 2,
                                mb: 2,
                            }}>
                            <TextField
                                size="small"
                                placeholder="Search transactions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{
                                    minWidth: 200,
                                    '& .MuiInputBase-root': {
                                        height: '35px'
                                    }
                                }}
                            />
                            <FormControl
                                size="small"
                                sx={{
                                    minWidth: { xs: '100%', sm: 200 },
                                    height: '35px',
                                    '& .MuiInputBase-root': {
                                        height: '35px'
                                    }
                                }}>
                                <InputLabel>Sort by</InputLabel>
                                <Select
                                    size="small"
                                    label="Sort by"
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    <MenuItem value="date_desc">Newest First</MenuItem>
                                    <MenuItem value="date_asc">Oldest First</MenuItem>
                                    <MenuItem value="amount_desc">Highest Amount</MenuItem>
                                    <MenuItem value="amount_asc">Lowest Amount</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                onClick={handleCreateClick}
                                startIcon={<span className="material-symbols-rounded">add</span>}
                                size="small"
                            >
                                New Transaction
                            </Button>
                        </Box>

                        {loading ? (
                            <Fade in timeout={300}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                    <CircularProgress />
                                </Box>
                            </Fade>
                        ) : filteredAndSortedTransactions.length === 0 ? (
                            <Fade in timeout={300}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    p: 3,
                                    minHeight: 200
                                }}>
                                    <Typography variant="h5" color="text.secondary">
                                        💸 Add your first transaction of the month 💸
                                    </Typography>
                                </Box>
                            </Fade>
                        ) : (
                            <Fade in timeout={500}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                }}>
                                    {filteredAndSortedTransactions.map((transaction) => (
                                        <Box
                                            key={transaction._id}
                                            onClick={() => handleTransactionClick(transaction)}
                                            onMouseEnter={() => setHoveredTransactionId(transaction._id)}
                                            onMouseLeave={() => setHoveredTransactionId(null)}
                                            sx={{
                                                p: 1,
                                                borderRadius: 3,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                backgroundColor: hoveredTransactionId === transaction._id
                                                    ? `${getCategoryColor(transaction.category)}25`
                                                    : 'transparent',
                                                transition: 'background-color 0.3s ease'
                                            }}
                                        >
                                            <Box sx={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                bgcolor: getCategoryColor(transaction.category),
                                                display: { xs: 'block', md: 'none' }
                                            }} />

                                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', px: 1 }}>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {transaction.description}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDateTime(transaction.date, user)}
                                                </Typography>
                                            </Box>

                                            <Box sx={{
                                                display: { xs: 'none', md: 'flex' },
                                                alignItems: 'center',
                                                gap: 1,
                                                flex: 1
                                            }}>
                                                <Box sx={{
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: '50%',
                                                    bgcolor: getCategoryColor(transaction.category)
                                                }} />
                                                <Typography>{transaction.category}</Typography>
                                            </Box>

                                            <Typography
                                                sx={{
                                                    color: transaction.amount >= 0
                                                        ? theme.palette.success.main
                                                        : theme.palette.error.main,
                                                    width: { xs: '25%', md: '20%' },
                                                    textAlign: 'right'
                                                }}
                                            >
                                                {formatCurrency(transaction.amount, user)}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Fade>
                        )}
                    </Box>
                </Paper>
            </Fade>

            <Drawer
                anchor="right"
                open={editDrawerOpen}
                onClose={handleCloseEditDrawer}
                slotProps={{
                    backdrop: {
                        timeout: 300,
                    },
                }}
                PaperProps={{
                    sx: {
                        width: { xs: '100%', sm: 500 },
                        bgcolor: 'background.default',
                    }
                }}
            >
                {selectedTransaction && (
                    <TransactionForm
                        transaction={selectedTransaction}
                        onSubmit={() => {
                            handleCloseEditDrawer();
                            onReload();
                        }}
                        onClose={handleCloseEditDrawer}
                        categories={categories}
                    />
                )}
            </Drawer>

            <Drawer
                anchor="right"
                open={createDrawerOpen}
                onClose={() => setCreateDrawerOpen(false)}
                slotProps={{
                    backdrop: {
                        timeout: 300,
                    },
                }}
                PaperProps={{
                    sx: { width: { xs: '100%', sm: 500 }, bgcolor: 'background.default' }
                }}
            >
                <TransactionForm
                    onSubmit={() => {
                        setCreateDrawerOpen(false);
                        onReload();
                    }}
                    onClose={() => setCreateDrawerOpen(false)}
                    categories={categories}
                />
            </Drawer>
        </Box>
    );
}