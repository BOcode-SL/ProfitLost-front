/**
 * CategoryForm Module
 * 
 * Provides an interface for creating, editing, and managing transaction categories
 * with comprehensive history tracking.
 * 
 * Features:
 * - Category name and color selection with visual preview
 * - Transaction history display for existing categories
 * - Year-based transaction filtering with quick selection
 * - Transaction search functionality with real-time filtering
 * - Month-based transaction grouping for organized display
 * - Responsive design optimized for different screen sizes
 * - Category deletion with appropriate safeguards
 * - Income and expense summary for selected year
 * 
 * @module CategoryForm
 */
import { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
    Paper,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    Divider
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Services
import { categoryService } from '../../../../../services/category.service';
import { transactionService } from '../../../../../services/transaction.service';

// Types
import type { Category } from '../../../../../types/supabase/categories';
import type { Transaction } from '../../../../../types/supabase/transactions';

/**
 * Interface for grouping transactions by month
 * 
 * @interface GroupedTransactions
 */
interface GroupedTransactions {
    [key: string]: Transaction[];
}

// Utils
import { formatCurrency, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../../../utils/currencyUtils';
import { fromSupabaseTimestamp } from '../../../../../utils/dateUtils';

/**
 * Constant array of month abbreviations in English for consistent sorting
 * Used to ensure months are displayed in chronological order
 */
const MONTH_ORDER = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/**
 * Props for the CategoryForm component
 * 
 * @interface CategoryFormProps
 */
interface CategoryFormProps {
    /** Optional category for edit mode (undefined for create mode) */
    category?: Category;
    
    /** Callback function when form is successfully submitted */
    onSubmit: () => void;
    
    /** Callback function to close the form */
    onClose: () => void;
    
    /** Optional callback function for deletion */
    onDelete?: () => void;
}

/**
 * CategoryForm Component
 * 
 * Renders a form for creating and editing transaction categories with
 * transaction history display for existing categories.
 * 
 * @param {CategoryFormProps} props - Component properties
 * @returns {JSX.Element} Rendered form component
 */
export default function CategoryForm({ category, onSubmit, onClose, onDelete }: CategoryFormProps) {
    const { t } = useTranslation();
    const { user } = useUser();
    const theme = useTheme();

    // Form state
    const [name, setName] = useState(category?.name || '');
    const [color, setColor] = useState(category?.color || '#ff8e38');
    const [saving, setSaving] = useState(false);

    // Transaction history state
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [yearsWithData, setYearsWithData] = useState<string[]>([]);
    const [allCategoryTransactions, setAllCategoryTransactions] = useState<Transaction[]>([]);
    const [displayTransactions, setDisplayTransactions] = useState<Transaction[]>([]);
    const [showTransactions, setShowTransactions] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isHidden, setIsHidden] = useState(isCurrencyHidden());

    /**
     * Fetch all transactions for the category when component mounts
     * Loads transaction history and determines available years with data
     */
    useEffect(() => {
        const fetchCategoryTransactions = async () => {
            if (!category) return;
            
            setIsLoading(true);
            try {
                const response = await transactionService.getTransactionsByCategory(category.id);
                if (response.success && Array.isArray(response.data)) {
                    // Store all transactions
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
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategoryTransactions();
    }, [category]);

    /**
     * Listen for currency visibility toggle events
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
     * Filter transactions based on selected year and search query
     * Updates the displayed transactions when filters change
     */
    useEffect(() => {
        if (!showTransactions || !allCategoryTransactions.length) {
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
                (category?.name.toLowerCase() || '').includes(searchQuery.toLowerCase())
            );
        }
        
        setDisplayTransactions(filtered);
    }, [selectedYear, searchQuery, showTransactions, allCategoryTransactions, category]);

    /**
     * Calculate total income, expenses and balance for the selected year
     */
    const categorySummary = useMemo(() => {
        // Filter transactions for the selected year
        const yearTransactions = allCategoryTransactions.filter(tx => {
            const date = fromSupabaseTimestamp(tx.transaction_date);
            return date.getFullYear().toString() === selectedYear;
        });

        // Calculate totals
        let income = 0;
        let expenses = 0;

        yearTransactions.forEach(tx => {
            if (tx.amount >= 0) {
                income += tx.amount;
            } else {
                expenses += tx.amount;
            }
        });

        // Return calculated values
        return {
            income,
            expenses: Math.abs(expenses) // Make it positive for display
        };
    }, [allCategoryTransactions, selectedYear]);

    // Group transactions by month for organized display
    const groupedTransactions: GroupedTransactions = {};

    /**
     * Process transactions to group them by month
     * Creates a temporary object to store transactions by month key
     */
    const tempGroupedByMonthKey: Record<string, Transaction[]> = {};

    displayTransactions.forEach(tx => {
        const date = fromSupabaseTimestamp(tx.transaction_date);
        // Get the short name of the month (Jan, Feb, etc.) for sorting
        const monthKey = date.toLocaleString('en-US', { month: 'short' });

        if (!tempGroupedByMonthKey[monthKey]) {
            tempGroupedByMonthKey[monthKey] = [];
        }
        tempGroupedByMonthKey[monthKey].push(tx);
    });

    /**
     * Convert month-grouped transactions to use translated month names
     * Ensures months appear in chronological order using MONTH_ORDER
     */
    MONTH_ORDER.forEach(monthKey => {
        if (tempGroupedByMonthKey[monthKey]) {
            // Use the translation for display
            const translatedMonth = t(`dashboard.common.monthNames.${monthKey}`);
            groupedTransactions[translatedMonth] = tempGroupedByMonthKey[monthKey];
        }
    });

    /**
     * Further filter grouped transactions based on search query
     * Creates a new object with only matching transactions
     */
    const filteredGroupedTransactions: GroupedTransactions = {};

    Object.entries(groupedTransactions).forEach(([month, monthTransactions]) => {
        const filteredTransactions = monthTransactions.filter(transaction =>
            transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (category?.name.toLowerCase() || '').includes(searchQuery.toLowerCase())
        );

        if (filteredTransactions.length > 0) {
            filteredGroupedTransactions[month] = filteredTransactions;
        }
    });

    /**
     * Handle form submission for creating or updating a category
     * Validates inputs and makes appropriate API calls
     */
    const handleSubmit = async () => {
        // Validate category name
        if (!name.trim()) {
            toast.error(t('dashboard.annualReport.categories.form.categoryNameRequired'));
            return;
        }

        setSaving(true);
        try {
            if (category) {
                // Update existing category
                const response = await categoryService.updateCategory(category.id, {
                    name: name.trim(),
                    color
                });

                if (response.success) {
                    toast.success(t('dashboard.annualReport.categories.success.updated'));
                    onSubmit();
                    onClose();
                }
            } else {
                // Create new category
                const response = await categoryService.createCategory({
                    name: name.trim(),
                    color
                });

                if (response.success) {
                    toast.success(t('dashboard.annualReport.categories.success.created'));
                    onSubmit();
                    onClose();
                }
            }
        } catch {
            toast.error(
                category 
                    ? t('dashboard.annualReport.categories.errors.updateError') 
                    : t('dashboard.annualReport.categories.errors.createError')
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Form header with title and close button */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={onClose} sx={{ mr: 2 }}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6">
                    {category 
                        ? t('dashboard.annualReport.categories.editCategory') 
                        : t('dashboard.annualReport.categories.addFirstCategory')}
                </Typography>
            </Box>

            {/* Category form */}
            <Box component="form" onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
                {/* Color picker and name input */}
                <Paper
                    elevation={3}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 1,
                        borderRadius: 3,
                        mb: 2
                    }}
                >
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        style={{ width: '60px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    />
                    <TextField
                        label={t('dashboard.annualReport.categories.form.categoryName')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        size="small"
                    />
                </Paper>

                {/* Action buttons */}
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    {category && onDelete && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={onDelete}
                            disabled={saving}
                            fullWidth
                        >
                            {t('dashboard.common.delete')}
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={saving}
                        fullWidth
                    >
                        {saving ? <CircularProgress size={24} /> : 
                         (category ? t('dashboard.common.update') : t('dashboard.common.create'))}
                    </Button>
                </Box>
            </Box>

            {/* Category summary and Transaction history section (only visible in edit mode) */}
            {category && yearsWithData.length > 0 && (
                <Paper
                    elevation={3}
                    sx={{
                        mt: 3,
                        p: { xs: 2, sm: 3 },
                        borderRadius: 3,
                    }}
                >
                    {/* Year selector */}
                    <FormControl
                        size="small"
                        sx={{
                            width: '100%',
                            mb: 3,
                            '& .MuiSelect-select': {
                                py: 1
                            }
                        }}
                    >
                        <Select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            sx={{
                                borderRadius: 2,
                                width: '100%'
                            }}
                        >
                            {yearsWithData.map((year) => (
                                <MenuItem key={year} value={year}>{year}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Financial Summary Section - Without "Summary" title */}
                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                        gap: 2,
                        mb: 3
                    }}>
                        {/* Income summary */}
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    boxShadow: 1,
                                    borderColor: theme.palette.chart.income
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <TrendingUpIcon 
                                    sx={{ 
                                        color: theme.palette.chart.income,
                                        mr: 1,
                                        fontSize: 20
                                    }} 
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
                                    transition: 'filter 0.3s ease',
                                    userSelect: isHidden ? 'none' : 'auto'
                                }}
                            >
                                {formatCurrency(categorySummary.income, user)}
                            </Typography>
                        </Paper>
                        
                        {/* Expenses summary */}
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    boxShadow: 1,
                                    borderColor: theme.palette.chart.expenses
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <TrendingDownIcon 
                                    sx={{ 
                                        color: theme.palette.chart.expenses,
                                        mr: 1,
                                        fontSize: 20
                                    }} 
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
                                    transition: 'filter 0.3s ease',
                                    userSelect: isHidden ? 'none' : 'auto'
                                }}
                            >
                                {formatCurrency(categorySummary.expenses, user)}
                            </Typography>
                        </Paper>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Transaction History Section - Modernized UI */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3
                    }}>
                        <Typography
                            sx={{
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                fontWeight: 600,
                            }}
                        >
                            {t('dashboard.annualReport.categories.form.history')}
                        </Typography>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setShowTransactions(!showTransactions)}
                            startIcon={showTransactions ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            sx={{
                                borderRadius: 8,
                                px: 2,
                                py: 0.5,
                                minWidth: { xs: 'auto', sm: '120px' }
                            }}
                        >
                            {showTransactions 
                                ? t('dashboard.annualReport.categories.form.hideTransactions') 
                                : t('dashboard.annualReport.categories.form.showTransactions')}
                        </Button>
                    </Box>
                    
                    {/* Search field for filtering transactions */}
                    {showTransactions && (
                        <TextField
                            fullWidth
                            size="small"
                            placeholder={t('dashboard.annualReport.categories.form.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <SearchIcon sx={{
                                        fontSize: 20,
                                        mr: 1,
                                        color: 'text.secondary'
                                    }} />
                                ),
                                sx: {
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-input': {
                                        py: 1
                                    }
                                }
                            }}
                            sx={{ mb: 3 }}
                        />
                    )}

                    {/* Transactions list grouped by month */}
                    {showTransactions && (
                        <>
                            {isLoading ? (
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    py: 4 
                                }}>
                                    <CircularProgress size={40} />
                                </Box>
                            ) : Object.keys(filteredGroupedTransactions).length > 0 ? (
                                <Box sx={{ mt: 2 }}>
                                    {Object.entries(filteredGroupedTransactions).map(([month, monthTransactions]) => (
                                        <Box
                                            key={month}
                                            sx={{
                                                mb: 3,
                                                '&:last-child': { mb: 0 }
                                            }}
                                        >
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
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        textTransform: 'capitalize',
                                                        fontWeight: 600,
                                                        color: 'text.primary',
                                                        fontSize: { xs: '0.9rem', sm: '1rem' }
                                                    }}
                                                >
                                                    {month}
                                                </Typography>
                                            </Box>
                                            {/* Transactions grid */}
                                            <Box sx={{
                                                display: 'grid',
                                                gap: 1.5,
                                                gridTemplateColumns: {
                                                    xs: '1fr',
                                                    md: 'repeat(auto-fill, minmax(250px, 1fr))'
                                                },
                                                maxWidth: '100%',
                                                overflow: 'hidden',
                                                px: { xs: 0, sm: 0.5 }
                                            }}>
                                                {/* Individual transaction cards */}
                                                {monthTransactions.map((transaction) => (
                                                    <Box
                                                        key={transaction.id}
                                                        sx={{
                                                            width: '100%',
                                                            position: 'relative',
                                                            transform: 'translate3d(0, 0, 0)',
                                                        }}
                                                    >
                                                        <Paper
                                                            elevation={0}
                                                            sx={{
                                                                p: { xs: 1.5, sm: 2 },
                                                                borderRadius: 2,
                                                                backgroundColor: 'background.default',
                                                                border: '1px solid',
                                                                borderColor: 'divider',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                gap: 1,
                                                                width: '100%',
                                                                maxWidth: '100%',
                                                                boxSizing: 'border-box',
                                                                transition: 'all 0.2s ease-in-out',
                                                                '&:hover': {
                                                                    borderColor: 'primary.main',
                                                                    boxShadow: 1
                                                                }
                                                            }}
                                                        >
                                                            <Box sx={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'flex-start',
                                                                gap: 2,
                                                                width: '100%'
                                                            }}>
                                                                {/* Transaction description */}
                                                                <Typography sx={{
                                                                    fontWeight: 500,
                                                                    fontSize: { xs: '0.9rem', sm: '0.95rem' },
                                                                    flex: '1 1 auto',
                                                                    overflow: 'hidden',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    lineHeight: 1.4,
                                                                    minWidth: 0,
                                                                    wordBreak: 'break-word'
                                                                }}>
                                                                    {transaction.description || (category ? category.name : '')}
                                                                </Typography>
                                                                {/* Transaction amount */}
                                                                <Typography sx={{
                                                                    fontWeight: 600,
                                                                    fontSize: { xs: '0.9rem', sm: '0.95rem' },
                                                                    color: transaction.amount >= 0
                                                                        ? theme.palette.chart.income
                                                                        : theme.palette.chart.expenses,
                                                                    whiteSpace: 'nowrap',
                                                                    flex: '0 0 auto',
                                                                    pt: 0.2
                                                                }}>
                                                                    {formatCurrency(transaction.amount, user)}
                                                                </Typography>
                                                            </Box>
                                                            {/* Transaction date */}
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 0.5,
                                                                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                                                    mt: 'auto'
                                                                }}
                                                            >
                                                                <ScheduleIcon sx={{ fontSize: 16 }} />
                                                                {fromSupabaseTimestamp(transaction.transaction_date).toLocaleDateString()}
                                                            </Typography>
                                                        </Paper>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            ) : searchQuery && (
                                /* Empty search results message */
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    py: 4,
                                    px: 2,
                                    textAlign: 'center'
                                }}>
                                    <SearchOffIcon sx={{ 
                                        fontSize: 48,
                                        mb: 2,
                                        color: 'text.secondary'
                                    }} />
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                                        {t('dashboard.annualReport.categories.form.noSearchResults')}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {t('dashboard.annualReport.categories.form.tryDifferentSearch')}
                                    </Typography>
                                </Box>
                            )}
                        </>
                    )}
                </Paper>
            )}
        </Box>
    );
}