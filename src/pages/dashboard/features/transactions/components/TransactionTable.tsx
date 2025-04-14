/**
 * TransactionTable Component
 * 
 * Provides an interactive list view of transactions with filtering, sorting, and CRUD operations.
 * Features include:
 * - Transaction filtering with text search
 * - Multiple sorting options (date, amount)
 * - Add/Edit/Delete transaction functionality
 * - Category color coding for visual identification
 * - Currency formatting based on user preferences
 * - Support for currency visibility toggling for privacy
 * - Loading states and empty state handling
 * - Responsive design for different screen sizes
 */
import { useState, useCallback, useEffect } from 'react';
import {
    Box,
    Paper,
    TextField,
    Select,
    MenuItem,
    Typography,
    CircularProgress,
    Button,
    FormControl,
    InputLabel,
    useTheme,
    Divider
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Types
import type { Transaction } from '../../../../../types/supabase/transactions';
import type { Category } from '../../../../../types/supabase/categories';

// Utils
import { formatCurrency, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../../../utils/currencyUtils';
import { formatDateTime } from '../../../../../utils/dateUtils';

// Components
import TransactionForm from './TransactionForm';
import DrawerBase from '../../../components/ui/DrawerBase';

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

    // Open the edit drawer when a transaction is selected
    const handleTransactionClick = useCallback((transaction: Transaction) => {
        setCreateDrawerOpen(false);
        setEditDrawerOpen(false);

        setSelectedTransaction(null);

        requestAnimationFrame(() => {
            setSelectedTransaction(transaction);
            setEditDrawerOpen(true);
        });
    }, []);

    // Close the edit drawer and clear the selected transaction after animation
    const handleCloseEditDrawer = useCallback(() => {
        setEditDrawerOpen(false);
        setTimeout(() => {
            setSelectedTransaction(null);
        }, 300);
    }, []);

    // Open the create drawer for adding a new transaction
    const handleCreateClick = useCallback(() => {
        setSelectedTransaction(null);
        setCreateDrawerOpen(true);
    }, []);

    // Get category by ID
    const getCategoryById = (categoryId: string) => {
        return categories.find(cat => cat.id === categoryId) || null;
    };

    // Get category name by ID
    const getCategoryNameById = (categoryId: string) => {
        const category = getCategoryById(categoryId);
        return category ? category.name : 'Uncategorized';
    };

    // Get category color for visual categorization of transactions
    const getCategoryColor = (categoryId: string) => {
        const category = getCategoryById(categoryId);
        return category?.color || theme.palette.grey[500];
    };

    // Apply filters and sorting to the transaction data
    const filteredAndSortedTransactions = data
        .filter(transaction => {
            const searchLower = searchTerm.toLowerCase();
            return (transaction.description ? transaction.description.toLowerCase().includes(searchLower) : false) ||
                transaction.amount.toString().includes(searchTerm);
        })
        .sort((a, b) => {
            switch (sortOption) {
                case 'date_desc':
                    return new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime();
                case 'date_asc':
                    return new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime();
                case 'amount_desc':
                    return b.amount - a.amount;
                case 'amount_asc':
                    return a.amount - b.amount;
                default:
                    return 0;
            }
        });

    // Main component structure
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
                {/* Controls container for search, sort and add functionality */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        p: 2,
                    }}>
                    {/* Search, sort and add transaction row */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'end',
                            flexDirection: { xs: 'column-reverse', sm: 'row' },
                            gap: 2,
                            mb: 2,
                        }}>
                        {/* Search field for filtering transactions */}
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
                        {/* Sort dropdown for changing transaction order */}
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
                        {/* Add transaction button */}
                        <Button
                            variant="contained"
                            onClick={handleCreateClick}
                            startIcon={<AddIcon />}
                            size="small"
                        >
                            {t('dashboard.transactions.table.addTransaction')}
                        </Button>
                    </Box>

                    {/* Conditional rendering based on data state */}
                    {loading ? (
                        // Loading state with spinner
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress sx={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
                        </Box>
                    ) : data.length === 0 ? (
                        // Empty state when no transactions exist
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
                        // No results state when search returns empty
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
                        // Transaction list with data
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                        }}>
                            {/* Transaction items */}
                            {filteredAndSortedTransactions.map((transaction) => (
                                <Box key={transaction.id}>
                                    <Box
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
                                                bgcolor: `${getCategoryColor(transaction.category_id)}20`
                                            }
                                        }}
                                    >
                                        {/* Category color indicator for mobile */}
                                        <Box sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            bgcolor: getCategoryColor(transaction.category_id),
                                            display: { xs: 'block', md: 'none' }
                                        }} />

                                        {/* Transaction description and date */}
                                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', px: 1 }}>
                                            <Typography variant="body1" fontWeight={500}>
                                                {transaction.description || t('dashboard.transactions.table.noDescription')}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDateTime(transaction.transaction_date, user)}
                                            </Typography>
                                        </Box>

                                        {/* Category display (desktop only) */}
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
                                                bgcolor: getCategoryColor(transaction.category_id)
                                            }} />
                                            <Typography>{getCategoryNameById(transaction.category_id)}</Typography>
                                        </Box>

                                        {/* Transaction amount with color coding */}
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
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* Edit transaction drawer */}
            <DrawerBase
                open={editDrawerOpen}
                onClose={handleCloseEditDrawer}
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
            </DrawerBase>

            {/* Create transaction drawer */}
            <DrawerBase
                open={createDrawerOpen}
                onClose={() => setCreateDrawerOpen(false)}
            >
                <TransactionForm
                    onSubmit={() => {
                        setCreateDrawerOpen(false);
                        onReload();
                    }}
                    onClose={() => setCreateDrawerOpen(false)}
                    categories={categories}
                />
            </DrawerBase>
        </Box>
    );
}