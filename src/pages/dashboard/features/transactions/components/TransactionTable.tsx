/**
 * TransactionTable Module
 * 
 * Provides a comprehensive interactive transaction management interface
 * with filtering, sorting and full CRUD operations.
 * 
 * Key Features:
 * - Transaction filtering with real-time text search capabilities
 * - Flexible sorting options (date ascending/descending, amount ascending/descending)
 * - Complete transaction management (view, add, edit, delete)
 * - Visual category identification with color coding
 * - Localized currency formatting based on user preferences
 * - Privacy mode with blurred monetary values
 * - Progressive loading states and empty state messaging
 * - Responsive layout adapting to different viewport sizes
 * - Drawer-based transaction form for better mobile experience
 * 
 * @module TransactionTable
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

/**
 * Props interface for the TransactionTable component
 * 
 * @interface TransactionTableProps
 */
interface TransactionTableProps {
    /** Array of transaction records to display in the table */
    data: Transaction[];

    /** Indicates if data is currently being loaded */
    loading: boolean;

    /** Available categories for transaction categorization */
    categories: Category[];

    /** Callback function to trigger data refresh */
    onReload: () => void;
}

/**
 * TransactionTable Component
 * 
 * Renders an interactive transaction list with filtering, sorting,
 * and CRUD operations through modals/drawers.
 * 
 * @param {TransactionTableProps} props - Component properties
 * @returns {JSX.Element} Rendered transaction table component
 */
export default function TransactionTable({
    data,
    loading,
    categories,
    onReload
}: TransactionTableProps) {
    const { t } = useTranslation();
    const { user } = useUser();
    const theme = useTheme();

    /**
     * Component State
     */
    /** Search filter text for transaction filtering */
    const [searchTerm, setSearchTerm] = useState('');

    /** Current sort option for transaction ordering */
    const [sortOption, setSortOption] = useState<string>('date_desc');

    /** Controls visibility of the edit transaction drawer */
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);

    /** Controls visibility of the create transaction drawer */
    const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

    /** Currently selected transaction for editing */
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    /** Controls whether monetary values should be blurred for privacy */
    const [isHidden, setIsHidden] = useState(isCurrencyHidden());

    /**
     * Listen for currency visibility toggle events across the application
     * Updates local component state when visibility changes elsewhere
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
     * Opens the edit drawer with the selected transaction
     * Uses animation frame to ensure smooth transitions
     * 
     * @param {Transaction} transaction - The transaction to be edited
     */
    const handleTransactionClick = useCallback((transaction: Transaction) => {
        setCreateDrawerOpen(false);
        setEditDrawerOpen(false);

        setSelectedTransaction(null);

        requestAnimationFrame(() => {
            setSelectedTransaction(transaction);
            setEditDrawerOpen(true);
        });
    }, []);

    /**
     * Closes the edit drawer with animation and cleans up state
     * Uses timeout to complete animation before state cleanup
     */
    const handleCloseEditDrawer = useCallback(() => {
        setEditDrawerOpen(false);
        setTimeout(() => {
            setSelectedTransaction(null);
        }, 300);
    }, []);

    /**
     * Opens the create drawer for adding a new transaction
     * Resets selection state to ensure clean form
     */
    const handleCreateClick = useCallback(() => {
        setSelectedTransaction(null);
        setCreateDrawerOpen(true);
    }, []);

    /**
     * Retrieves the category object for a given category ID
     * 
     * @param {string} categoryId - The category ID to look up
     * @returns {Category|null} The found category or null if not found
     */
    const getCategoryById = (categoryId: string) => {
        return categories.find(cat => cat.id === categoryId) || null;
    };

    /**
     * Gets the display name for a category based on its ID
     * Falls back to "Uncategorized" if category not found
     * 
     * @param {string} categoryId - The category ID to look up
     * @returns {string} The category name or fallback text
     */
    const getCategoryNameById = (categoryId: string) => {
        const category = getCategoryById(categoryId);
        return category ? category.name : 'Uncategorized';
    };

    /**
     * Retrieves the color for a category based on its ID
     * Used for visual identification of transaction categories
     * 
     * @param {string} categoryId - The category ID to look up
     * @returns {string} The color code or fallback color
     */
    const getCategoryColor = (categoryId: string) => {
        const category = getCategoryById(categoryId);
        return category?.color || theme.palette.grey[500];
    };

    /**
     * Filtered and sorted transactions based on search term and sort option
     * Applies both text filtering and appropriate sorting logic
     */
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
                    {/* Search, sort and add transaction controls row */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'end',
                            flexDirection: { xs: 'column-reverse', sm: 'row' },
                            gap: 2,
                            mb: 2,
                        }}>
                        {/* Search field for filtering transactions by text */}
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
                        {/* Sort dropdown for ordering transactions */}
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
                        {/* Add transaction button to open creation form */}
                        <Button
                            variant="contained"
                            onClick={handleCreateClick}
                            startIcon={<AddIcon />}
                            size="small"
                        >
                            {t('dashboard.transactions.table.addTransaction')}
                        </Button>
                    </Box>

                    {/* Conditional content rendering based on data state */}
                    {loading ? (
                        // Loading state with centered spinner
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress sx={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
                        </Box>
                    ) : data.length === 0 ? (
                        // Empty state when no transactions exist at all
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
                        // No results state when search filters out all transactions
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
                        // Transaction list rendering when data is available
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            {/* Transaction item rows with click handling */}
                            {filteredAndSortedTransactions.map((transaction) => (
                                <Box key={transaction.id}>
                                    <Box
                                        onClick={() => handleTransactionClick(transaction)}
                                        sx={{
                                            p: 1,
                                            my: 1,
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
                                        {/* Category color indicator for mobile view */}
                                        <Box sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            bgcolor: getCategoryColor(transaction.category_id),
                                            display: { xs: 'block', md: 'none' }
                                        }} />

                                        {/* Transaction description and date information */}
                                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', px: 1 }}>
                                            <Typography variant="body1" fontWeight={500}>
                                                {transaction.description || t('dashboard.transactions.table.noDescription')}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDateTime(transaction.transaction_date, user)}
                                            </Typography>
                                        </Box>

                                        {/* Category display with color indicator (desktop only) */}
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

                                        {/* Transaction amount with color coding and privacy blur */}
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

            {/* Transaction edit drawer - appears when editing a transaction */}
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

            {/* Transaction create drawer - appears when adding a new transaction */}
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