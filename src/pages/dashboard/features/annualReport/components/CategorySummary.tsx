/**
 * CategorySummary Module
 * 
 * Provides a comprehensive view of a category's financial summary and transaction history
 * with options to edit category properties or delete the category.
 * 
 * Features:
 * - Category overview with icon, name, and color
 * - Year selector for viewing historical data
 * - Income and expense summary for selected year
 * - Monthly transaction breakdown with search functionality
 * - Transaction history grouped by month
 * - Edit and delete category options
 * - Responsive design optimized for different screen sizes
 * 
 * @module CategorySummary
 */
import { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Button,
    Typography,
    CircularProgress,
    Paper,
    IconButton,
    TextField,
    useTheme,
    Card,
    CardContent,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SearchOffIcon from '@mui/icons-material/SearchOff';


// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Services
import { categoryService } from '../../../../../services/category.service';
import { transactionService } from '../../../../../services/transaction.service';

// Types
import type { Category } from '../../../../../types/supabase/categories';
import type { Transaction } from '../../../../../types/supabase/transactions';

// Utils
import { formatCurrency, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../../../utils/currencyUtils';
import { fromSupabaseTimestamp } from '../../../../../utils/dateUtils';

/**
 * Interface for grouping transactions by month
 */
interface GroupedTransactions {
    [key: string]: Transaction[];
}

/**
 * Props for the CategorySummary component
 */
interface CategorySummaryProps {
    /** Category to display summary for */
    category: Category;

    /** Callback when form is successfully submitted */
    onSubmit: () => void;

    /** Callback to close the summary */
    onClose: () => void;

    /** Callback to open edit form */
    onEdit: (category: Category) => void;

    /** Optional callback to get action buttons for external use */
    onGetActions?: (actions: React.ReactNode) => void;
}

/**
 * Transition component for dialogs
 */
const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * Month order for consistent sorting
 */
const MONTH_ORDER = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/**
 * CategorySummary Component
 * 
 * Displays a comprehensive summary of a category including transaction history,
 * financial statistics, and management options.
 */
export default function CategorySummary({ category, onSubmit, onClose, onEdit, onGetActions }: CategorySummaryProps) {
    const { t } = useTranslation();
    const { user } = useUser();
    const theme = useTheme();

    // State
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [yearsWithData, setYearsWithData] = useState<string[]>([]);
    const [allCategoryTransactions, setAllCategoryTransactions] = useState<Transaction[]>([]);
    const [displayTransactions, setDisplayTransactions] = useState<Transaction[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isHidden, setIsHidden] = useState(isCurrencyHidden());
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    /**
     * Fetch all transactions for the category when component mounts
     */
    useEffect(() => {
        const fetchCategoryTransactions = async () => {
            setIsLoading(true);
            try {
                const response = await transactionService.getTransactionsByCategory(category.id);
                if (response.success && Array.isArray(response.data)) {
                    setAllCategoryTransactions(response.data);

                    // Find years that have transactions
                    const years = new Set(
                        response.data.map(tx =>
                            fromSupabaseTimestamp(tx.transaction_date).getFullYear().toString()
                        )
                    );

                    // Sort years in descending order (newest first)
                    const sortedYears = [...years].sort((a, b) => Number(b) - Number(a));
                    setYearsWithData(sortedYears);

                    // If we have years, set the selected year to the newest one
                    if (sortedYears.length > 0) {
                        setSelectedYear(sortedYears[0]);
                    }
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
                toast.error(t('dashboard.common.error.loading'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategoryTransactions();
    }, [category.id, t]);

    /**
     * Listen for currency visibility toggle events
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
     * Filter transactions based on selected year and search query
     */
    useEffect(() => {
        if (!allCategoryTransactions.length) {
            setDisplayTransactions([]);
            return;
        }

        // First filter by year
        let filtered = allCategoryTransactions.filter(tx => {
            const date = fromSupabaseTimestamp(tx.transaction_date);
            return date.getFullYear().toString() === selectedYear;
        });

        // Then filter by search query if it exists
        if (searchQuery) {
            filtered = filtered.filter(tx =>
                tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                category.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setDisplayTransactions(filtered);
    }, [selectedYear, searchQuery, allCategoryTransactions, category.name]);

    /**
     * Calculate total income, expenses and balance for the selected year
     */
    const categorySummary = useMemo(() => {
        const yearTransactions = allCategoryTransactions.filter(tx => {
            const date = fromSupabaseTimestamp(tx.transaction_date);
            return date.getFullYear().toString() === selectedYear;
        });

        let income = 0;
        let expenses = 0;

        yearTransactions.forEach(tx => {
            if (tx.amount >= 0) {
                income += tx.amount;
            } else {
                expenses += tx.amount;
            }
        });

        return {
            income,
            expenses: Math.abs(expenses),
            transactionCount: yearTransactions.length
        };
    }, [allCategoryTransactions, selectedYear]);

    /**
     * Group transactions by month for organized display
     */
    const groupedTransactions: GroupedTransactions = useMemo(() => {
        const tempGroupedByMonthKey: Record<string, Transaction[]> = {};

        displayTransactions.forEach(tx => {
            const date = fromSupabaseTimestamp(tx.transaction_date);
            const monthKey = date.toLocaleString('en-US', { month: 'short' });

            if (!tempGroupedByMonthKey[monthKey]) {
                tempGroupedByMonthKey[monthKey] = [];
            }
            tempGroupedByMonthKey[monthKey].push(tx);
        });

        // Sort transactions within each month by date (ascending: day 1 first, then day 30)
        Object.keys(tempGroupedByMonthKey).forEach(monthKey => {
            tempGroupedByMonthKey[monthKey].sort((a, b) => {
                const dateA = fromSupabaseTimestamp(a.transaction_date);
                const dateB = fromSupabaseTimestamp(b.transaction_date);
                return dateA.getTime() - dateB.getTime();
            });
        });

        const result: GroupedTransactions = {};
        MONTH_ORDER.forEach(monthKey => {
            if (tempGroupedByMonthKey[monthKey]) {
                const translatedMonth = t(`dashboard.common.monthNames.${monthKey}`);
                result[translatedMonth] = tempGroupedByMonthKey[monthKey];
            }
        });

        return result;
    }, [displayTransactions, t]);



    /**
     * Handle category deletion
     */
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await categoryService.deleteCategory(category.id);
            if (response.success) {
                toast.success(t('dashboard.annualReport.categories.success.deleted'));
                onSubmit();
                onClose();
            }
        } catch {
            toast.error(t('dashboard.common.error.DELETE_ERROR'));
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
        }
    };

    /**
     * Creates action buttons for external use
     */
    const actionButtons = useMemo(() => (
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                fullWidth
            >
                {t('dashboard.common.delete')}
            </Button>
            <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => onEdit(category)}
                fullWidth
            >
                {t('dashboard.annualReport.categories.editCategory')}
            </Button>
        </Box>
    ), [t, onEdit, category]);

    /**
     * Notify parent component of action buttons when they change
     */
    useEffect(() => {
        onGetActions?.(actionButtons);
    }, [actionButtons, onGetActions]);

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                p: 3,
                borderBottom: 1,
                borderColor: 'divider'
            }}>
                <IconButton onClick={onClose} sx={{ mr: 2 }}>
                    <CloseIcon />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            backgroundColor: `${category.color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{ color: category.color, fontWeight: 600 }}
                        >
                            {category.name.charAt(0).toUpperCase()}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight={600}>
                            {category.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {categorySummary.transactionCount} {t('dashboard.annualReport.categories.form.transactions')}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                {/* Year Selector */}
                <Paper elevation={1} sx={{ p: 1, mb: 3, borderRadius: 3 }}>
                    <FormControl size="small" fullWidth>
                        <InputLabel>{t('dashboard.common.year')}</InputLabel>
                        <Select
                            value={selectedYear}
                            label={t('dashboard.common.year')}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            {yearsWithData.map(year => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>

                {/* Financial Summary */}
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 3,
                    flexDirection: { xs: 'column', sm: 'row' }
                }}>
                    <Box sx={{ flex: 1 }}>
                        <Card elevation={1} sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <TrendingUpIcon
                                        sx={{ color: theme.palette.chart.income, mr: 1, fontSize: 20 }}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {t('dashboard.common.income')}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: theme.palette.chart.income,
                                        fontWeight: 600,
                                        filter: isHidden ? 'blur(8px)' : 'none',
                                        transition: 'filter 0.3s ease'
                                    }}
                                >
                                    {formatCurrency(categorySummary.income, user)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Card elevation={1} sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <TrendingDownIcon
                                        sx={{ color: theme.palette.chart.expenses, mr: 1, fontSize: 20 }}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {t('dashboard.common.expenses')}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: theme.palette.chart.expenses,
                                        fontWeight: 600,
                                        filter: isHidden ? 'blur(8px)' : 'none',
                                        transition: 'filter 0.3s ease'
                                    }}
                                >
                                    {formatCurrency(categorySummary.expenses, user)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>

                {/* Transaction History */}
                <Paper elevation={1} sx={{ borderRadius: 2 }}>
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                            {t('dashboard.annualReport.categories.form.history')}
                        </Typography>
                    </Box>

                    {/* Search */}
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder={t('dashboard.annualReport.categories.form.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <SearchIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                                ),
                                sx: { borderRadius: 2 }
                            }}
                        />
                    </Box>

                    {/* Transactions List */}
                    <Box>
                        {isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : Object.keys(groupedTransactions).length > 0 ? (
                            <Box sx={{ p: 2 }}>
                                {Object.entries(groupedTransactions).map(([month, monthTransactions]) => (
                                    <Box key={month} sx={{ mb: 3 }}>
                                        {/* Month header */}
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                            pb: 1,
                                            borderBottom: '1px solid',
                                            borderColor: 'divider'
                                        }}>
                                            <CalendarMonthIcon sx={{
                                                fontSize: 20,
                                                color: 'primary.main',
                                                mr: 1.5
                                            }} />
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                {month}
                                            </Typography>
                                        </Box>

                                        {/* Transactions */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            {monthTransactions.map((transaction) => (
                                                <Box key={transaction.id}>
                                                    <Box
                                                        sx={{
                                                            p: 1,
                                                            my: 1,
                                                            borderRadius: 3,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                            transition: 'background-color 0.3s ease',
                                                            '&:hover': {
                                                                bgcolor: `${category.color}20`,
                                                            },
                                                        }}
                                                    >


                                                        {/* Transaction description and date information */}
                                                        <Box
                                                            sx={{
                                                                flex: 1,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                px: 1,
                                                            }}
                                                        >
                                                            <Typography variant="body1">
                                                                {transaction.description || category.name}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {fromSupabaseTimestamp(transaction.transaction_date).toLocaleDateString()}
                                                            </Typography>
                                                        </Box>

                                                        {/* Transaction amount with color coding and privacy blur */}
                                                        <Typography
                                                            sx={{
                                                                color: transaction.amount >= 0
                                                                    ? theme.palette.chart.income
                                                                    : theme.palette.chart.expenses,
                                                                width: { xs: '25%', md: '20%' },
                                                                textAlign: 'right',
                                                                fontWeight: 600,
                                                                filter: isHidden ? 'blur(8px)' : 'none',
                                                                transition: 'filter 0.3s ease',
                                                                userSelect: isHidden ? 'none' : 'auto',
                                                            }}
                                                        >
                                                            {formatCurrency(transaction.amount, user)}
                                                        </Typography>
                                                    </Box>
                                                    <Divider />
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        ) : searchQuery ? (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                p: 4,
                                textAlign: 'center'
                            }}>
                                <SearchOffIcon sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                                    {t('dashboard.annualReport.categories.form.noSearchResults')}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {t('dashboard.annualReport.categories.form.tryDifferentSearch')}
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="body1" color="text.secondary">
                                    {t('dashboard.annualReport.categories.form.noTransactions')}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Box>



            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                TransitionComponent={Transition}
                onClose={() => setDeleteDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {t('dashboard.annualReport.categories.delete.title')}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {t('dashboard.annualReport.categories.delete.confirmMessage')}
                        <Typography component="span" fontWeight="bold" color="primary">
                            {category.name}
                        </Typography>
                        ?
                    </Typography>
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        {t('dashboard.annualReport.categories.delete.warning')}
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        {t('dashboard.common.cancel')}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <CircularProgress size={24} /> : t('dashboard.common.delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
} 