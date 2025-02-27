import { useState, useCallback, useEffect } from 'react';
import { Box, Paper, TextField, Select, MenuItem, Typography, CircularProgress, Drawer, Button, FormControl, InputLabel, useTheme, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Types
import type { Transaction } from '../../../../../types/models/transaction';
import type { Category } from '../../../../../types/models/category';

// Utils
import { formatCurrency, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../../../utils/currencyUtils';
import { formatDateTime } from '../../../../../utils/dateUtils';

// Components
import TransactionForm from './TransactionForm';

// Interface for the props of the TransactionTable component
interface TransactionTableProps {
    data: Transaction[]; // Array of transactions
    loading: boolean; // Indicates if the data is currently loading
    categories: Category[]; // Array of categories
    onReload: () => void; // Function to reload the transaction data
}

// TransactionTable component
export default function TransactionTable({
    data,
    loading,
    categories,
    onReload
}: TransactionTableProps) {
    const { t } = useTranslation();
    const { user } = useUser();
    const theme = useTheme();

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState<string>('date_desc');
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);
    const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isHidden, setIsHidden] = useState(isCurrencyHidden());

    // Listen for changes in currency visibility
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

    // Handle the transaction click
    const handleTransactionClick = useCallback((transaction: Transaction) => {
        setCreateDrawerOpen(false);
        setEditDrawerOpen(false);

        setSelectedTransaction(null);

        requestAnimationFrame(() => {
            setSelectedTransaction(transaction);
            setEditDrawerOpen(true);
        });
    }, []);

    // Handle the close edit drawer
    const handleCloseEditDrawer = useCallback(() => {
        setEditDrawerOpen(false);
        setTimeout(() => {
            setSelectedTransaction(null);
        }, 300);
    }, []);

    // Handle the create click
    const handleCreateClick = useCallback(() => {
        setSelectedTransaction(null);
        setCreateDrawerOpen(true);
    }, []);

    // Get the category color
    const getCategoryColor = (categoryName: string) => {
        const category = categories.find(cat => cat.name === categoryName);
        return category?.color || theme.palette.grey[500];
    };

    // Filter and sort the transactions
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

    // Return the main container for the transaction table
    return (
        <Box sx={{ width: '100%' }}>
            <Paper
                elevation={3}
                sx={{
                    p: 1,
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    flexWrap: { xs: 'wrap', sm: 'nowrap' }
                }}>
                {/* Container for filters and search functionality */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        p: 2,
                    }}>
                    {/* Box for search and sort options */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'end',
                            flexDirection: { xs: 'column-reverse', sm: 'row' },
                            gap: 2,
                            mb: 2,
                        }}>
                        {/* TextField for searching transactions */}
                        <TextField
                            size="small"
                            placeholder={t('dashboard.transactions.filters.search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{
                                minWidth: 200,
                                '& .MuiInputBase-root': {
                                    height: '35px'
                                }
                            }}
                        />
                        {/* FormControl for sorting transactions */}
                        <FormControl
                            size="small"
                            sx={{
                                minWidth: { xs: '100%', sm: 200 },
                                height: '35px',
                                '& .MuiInputBase-root': {
                                    height: '35px'
                                }
                            }}>
                            <InputLabel>{t('dashboard.transactions.filters.sort.label')}</InputLabel>
                            <Select
                                size="small"
                                label={t('dashboard.transactions.filters.sort.label')}
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <MenuItem value="date_desc">{t('dashboard.transactions.filters.sort.dateDesc')}</MenuItem>
                                <MenuItem value="date_asc">{t('dashboard.transactions.filters.sort.dateAsc')}</MenuItem>
                                <MenuItem value="amount_desc">{t('dashboard.transactions.filters.sort.amountDesc')}</MenuItem>
                                <MenuItem value="amount_asc">{t('dashboard.transactions.filters.sort.amountAsc')}</MenuItem>
                            </Select>
                        </FormControl>
                        {/* Button to create a new transaction */}
                        <Button
                            variant="contained"
                            onClick={handleCreateClick}
                            startIcon={<span className="material-symbols-rounded">add</span>}
                            size="small"
                        >
                            {t('dashboard.transactions.table.addTransaction')}
                        </Button>
                    </Box>

                    {/* Conditional rendering based on loading state */}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress sx={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
                        </Box>
                    ) : data.length === 0 ? (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: 3,
                            minHeight: 200
                        }}>
                            <Typography variant="h5" color="text.secondary">
                                {t('dashboard.transactions.table.addTransactionBanner')}
                            </Typography>
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
                                🔍 {t('dashboard.transactions.table.noTransactionsFound')} "{searchTerm}" 🔍
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                        }}>
                            {/* Map through filtered and sorted transactions */}
                            {filteredAndSortedTransactions.map((transaction) => (
                                <>
                                    <Box
                                        key={transaction._id}
                                        onClick={() => handleTransactionClick(transaction)}
                                        sx={{
                                            p: 1,
                                            borderRadius: 3,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            transition: 'background-color 0.3s ease',
                                            '&:hover': {
                                                bgcolor: `${getCategoryColor(transaction.category)}20`
                                            }
                                        }}
                                    >
                                        {/* Circle indicator for category color on mobile */}
                                        <Box sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            bgcolor: getCategoryColor(transaction.category),
                                            display: { xs: 'block', md: 'none' }
                                        }} />

                                        {/* Transaction description and date */}
                                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', px: 1 }}>
                                            <Typography variant="body1" fontWeight={500}>
                                                {transaction.description}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDateTime(transaction.date, user)}
                                            </Typography>
                                        </Box>

                                        {/* Category display for larger screens */}
                                        <Box sx={{
                                            display: { xs: 'none', md: 'flex' },
                                            alignItems: 'center',
                                            gap: 1,
                                            flex: 1
                                        }}>
                                            <Box sx={{
                                                width: 15,
                                                height: 15,
                                                borderRadius: '50%',
                                                bgcolor: getCategoryColor(transaction.category)
                                            }} />
                                            <Typography>{transaction.category}</Typography>
                                        </Box>

                                        {/* Display transaction amount with conditional color */}
                                        <Typography
                                            sx={{
                                                color: transaction.amount >= 0
                                                    ? theme.palette.chart.income
                                                    : theme.palette.chart.expenses,
                                                width: { xs: '25%', md: '20%' },
                                                textAlign: 'right',
                                                filter: isHidden ? 'blur(8px)' : 'none',
                                                transition: 'filter 0.3s ease',
                                                userSelect: isHidden ? 'none' : 'auto'
                                            }}
                                        >
                                            {formatCurrency(transaction.amount, user)}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                </>
                            ))}
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* Drawer for editing a selected transaction */}
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
                        width: { xs: '100%', sm: 500 }
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

            {/* Drawer for creating a new transaction */}
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
                    sx: { width: { xs: '100%', sm: 500 } }
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