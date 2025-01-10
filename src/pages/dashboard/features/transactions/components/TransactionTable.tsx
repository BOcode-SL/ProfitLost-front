import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useTheme } from '@mui/material/styles';

import type { Transaction } from '../../../../../types/models/transaction.modelTypes';
import type { Category } from '../../../../../types/models/category.modelTypes';

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
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('date_desc');
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [hoveredTransactionId, setHoveredTransactionId] = useState<string | null>(null);

    const getCategoryColor = (categoryName: string) => {
        const category = categories.find(cat => cat.name === categoryName);
        return category?.color || theme.palette.grey[500];
    };

    const handleTransactionClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setEditDrawerOpen(true);
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
                            flexDirection: { xs: 'column', sm: 'row' },
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
                            onClick={() => { }}
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
                            New Transaction
                        </Button>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredAndSortedTransactions.length === 0 ? (
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
                    ) : (
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
                                            {new Date(transaction.date).toLocaleDateString()}
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
                                        {new Intl.NumberFormat('es-ES', {
                                            style: 'currency',
                                            currency: 'EUR'
                                        }).format(transaction.amount)}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </Paper>

            <Drawer
                anchor="right"
                open={editDrawerOpen}
                onClose={() => setEditDrawerOpen(false)}
                PaperProps={{
                    sx: { width: { xs: '100%', sm: 500 } }
                }}
            >
                {/* Aquí irá el formulario de edición */}
                {/* <TransactionForm 
                    transaction={selectedTransaction}
                    onSubmit={() => {
                        setEditDrawerOpen(false);
                        onReload();
                    }}
                    onClose={() => setEditDrawerOpen(false)}
                /> */}
            </Drawer>
        </Box>
    );
}