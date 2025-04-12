/**
 * CategoryForm Component
 * 
 * Form for creating and editing transaction categories.
 * Features include:
 * - Category name and color selection
 * - Transaction history display for existing categories
 * - Year-based transaction filtering 
 * - Transaction search functionality
 * - Month-based transaction grouping
 * - Responsive design for different screen sizes
 * - Category deletion with confirmation
 */
import { useState, useEffect } from 'react';
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
    useTheme
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

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Services
import { categoryService } from '../../../../../services/category.service';
import { transactionService } from '../../../../../services/transaction.service';

// Types
import type { Category } from '../../../../../types/supabase/category';
import type { Transaction } from '../../../../../types/supabase/transaction';
interface GroupedTransactions {
    [key: string]: Transaction[];
}

// Utils
import { formatCurrency } from '../../../../../utils/currencyUtils';
import { fromSupabaseTimestamp } from '../../../../../utils/dateUtils';

// Month abbreviations in English for consistent sorting
const MONTH_ORDER = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Interface for the props of the CategoryForm component
interface CategoryFormProps {
    category?: Category; // Optional category for edit mode (undefined for create mode)
    onSubmit: () => void; // Callback function when form is successfully submitted
    onClose: () => void; // Callback function to close the form
    onDelete?: () => void; // Optional callback function for deletion
}

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
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [showTransactions, setShowTransactions] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch years with transaction data for the category
    useEffect(() => {
        const fetchAllTransactions = async () => {
            if (!category) return;

            try {
                const response = await transactionService.getAllTransactions();
                if (response.success && Array.isArray(response.data)) {
                    // Find years that have transactions with this category
                    const years = new Set(
                        response.data
                            .filter(tx => tx.category_id === category.id)
                            .map(tx => fromSupabaseTimestamp(tx.transaction_date).getFullYear().toString())
                    );
                    // Sort years in descending order (newest first)
                    setYearsWithData([...years].sort((a, b) => Number(b) - Number(a)));
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchAllTransactions();
    }, [category]);

    // Fetch transactions for the selected year and category
    useEffect(() => {
        const fetchTransactions = async () => {
            if (!category || !showTransactions) return;

            try {
                const response = await transactionService.getTransactionsByYear(Number(selectedYear));
                if (response.success && Array.isArray(response.data)) {
                    // Filter transactions to only show those for this category
                    const filteredTransactions = response.data.filter(tx => tx.category_id === category.id);
                    setTransactions(filteredTransactions);
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [category, selectedYear, showTransactions]);

    // Group transactions by month for organized display
    const groupedTransactions: GroupedTransactions = {};

    // Create an object to store transactions grouped by month key
    const tempGroupedByMonthKey: Record<string, Transaction[]> = {};

    transactions.forEach(tx => {
        const date = fromSupabaseTimestamp(tx.transaction_date);
        // Get the short name of the month (Jan, Feb, etc.) for sorting
        const monthKey = date.toLocaleString('en-US', { month: 'short' });

        if (!tempGroupedByMonthKey[monthKey]) {
            tempGroupedByMonthKey[monthKey] = [];
        }
        tempGroupedByMonthKey[monthKey].push(tx);
    });

    // Sort months by calendar order and translate them
    MONTH_ORDER.forEach(monthKey => {
        if (tempGroupedByMonthKey[monthKey]) {
            // Use the translation for display
            const translatedMonth = t(`dashboard.common.monthNames.${monthKey}`);
            groupedTransactions[translatedMonth] = tempGroupedByMonthKey[monthKey];
        }
    });

    // Filter transactions based on search query
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

    // Handle form submission (create or update)
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

            {/* Transaction history section (only visible in edit mode) */}
            {category && yearsWithData.length > 0 && (
                <Paper
                    elevation={3}
                    sx={{
                        mt: 3,
                        p: { xs: 2, sm: 3 },
                        borderRadius: 3,
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: { xs: 'stretch', sm: 'center' },
                        mb: 3,
                        pb: 2,
                        gap: { xs: 2, sm: 0 }
                    }}>
                        <Typography
                            sx={{
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                fontWeight: 600,
                                mb: { xs: 1, sm: 2 },
                                textAlign: { xs: 'center', sm: 'left' }
                            }}
                        >
                            {t('dashboard.annualReport.categories.form.history')}
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            flexDirection: 'column',
                            width: '100%'
                        }}>
                            {/* Year selector */}
                            <FormControl
                                size="small"
                                sx={{
                                    width: '100%',
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
                            {/* Toggle button to show/hide transactions */}
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setShowTransactions(!showTransactions)}
                                startIcon={showTransactions ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                sx={{
                                    borderRadius: 2,
                                    width: '100%'
                                }}
                            >
                                {showTransactions 
                                    ? t('dashboard.annualReport.categories.form.hideTransactions') 
                                    : t('dashboard.annualReport.categories.form.showTransactions')}
                            </Button>
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
                                />
                            )}
                        </Box>
                    </Box>

                    {/* Transactions list grouped by month */}
                    {showTransactions && (
                        <>
                            {Object.keys(filteredGroupedTransactions).length > 0 ? (
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
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    mb: 2,
                                                    textTransform: 'capitalize',
                                                    fontWeight: 600,
                                                    color: 'text.secondary',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    fontSize: { xs: '0.9rem', sm: '1rem' }
                                                }}
                                            >
                                                <CalendarMonthIcon sx={{ fontSize: 20 }} />
                                                {month}
                                            </Typography>
                                            {/* Transactions grid */}
                                            <Box sx={{
                                                display: 'grid',
                                                gap: 1.5,
                                                gridTemplateColumns: {
                                                    xs: '1fr',
                                                    md: 'repeat(auto-fit, minmax(250px, 1fr))'
                                                },
                                                maxWidth: '100%',
                                                overflow: 'hidden',
                                                p: { xs: 0, sm: 0.5 }
                                            }}>
                                                {/* Individual transaction cards */}
                                                {monthTransactions.map((transaction) => (
                                                    <Box
                                                        key={transaction.id}
                                                        sx={{
                                                            width: '100%',
                                                            position: 'relative',
                                                            transform: 'translate3d(0, 0, 0)',
                                                            '&:hover': {
                                                                '& > .MuiPaper-root': {
                                                                    borderColor: 'primary.main',
                                                                    boxShadow: 1,
                                                                    transition: 'all 0.2s ease-in-out'
                                                                }
                                                            }
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
                                                                    {transaction.description || category.name}
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
                                // Empty search results message
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