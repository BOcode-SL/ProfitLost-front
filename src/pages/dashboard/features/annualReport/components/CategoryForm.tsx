import { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Paper, IconButton, Select, MenuItem, FormControl, InputLabel, Link, useTheme } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Services
import { categoryService } from '../../../../../services/category.service';
import { transactionService } from '../../../../../services/transaction.service';

// Types
import type { Category } from '../../../../../types/models/category';
import type { Transaction } from '../../../../../types/models/transaction';
interface GroupedTransactions {
    [key: string]: Transaction[];
}

// Utils
import { formatCurrency } from '../../../../../utils/currencyUtils';
import { fromUTCtoLocal } from '../../../../../utils/dateUtils';

// Interface for the props of the CategoryForm component
interface CategoryFormProps {
    category?: Category; // Optional category prop
    onSubmit: () => void; // Function to call upon form submission
    onClose: () => void; // Function to call to close the form
    onDelete?: () => void; // Optional function to call for deletion
}

// CategoryForm component
export default function CategoryForm({ category, onSubmit, onClose, onDelete }: CategoryFormProps) {
    const { t } = useTranslation();
    const { user } = useUser();
    const theme = useTheme();

    const [name, setName] = useState(category?.name || '');
    const [color, setColor] = useState(category?.color || '#ff8e38');
    const [saving, setSaving] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [yearsWithData, setYearsWithData] = useState<string[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [showTransactions, setShowTransactions] = useState(false);

    // Effect to load years with available transaction data
    useEffect(() => {
        const fetchAllTransactions = async () => {
            if (!category) return;

            try {
                const response = await transactionService.getAllTransactions();
                if (response.success && Array.isArray(response.data)) {
                    const years = new Set(
                        response.data
                            .filter(tx => tx.category === category.name)
                            .map(tx => fromUTCtoLocal(tx.date).getFullYear().toString())
                    );
                    setYearsWithData([...years].sort((a, b) => Number(b) - Number(a)));
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchAllTransactions();
    }, [category]);

    // Effect to load transactions for the selected year
    useEffect(() => {
        const fetchTransactions = async () => {
            if (!category || !showTransactions) return;

            try {
                const response = await transactionService.getTransactionsByYear(Number(selectedYear));
                if (response.success && Array.isArray(response.data)) {
                    const filteredTransactions = response.data.filter(tx => tx.category === category.name);
                    setTransactions(filteredTransactions);
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [category, selectedYear, showTransactions]);

    // Group transactions by month
    const groupedTransactions: GroupedTransactions = {};
    transactions.forEach(tx => {
        const date = fromUTCtoLocal(tx.date);
        const month = date.toLocaleString('default', { month: 'long' });
        if (!groupedTransactions[month]) {
            groupedTransactions[month] = [];
        }
        groupedTransactions[month].push(tx);
    });

    // Handle the submission of the form
    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error(t('dashboard.annualReport.categories.form.categoryNameRequired'));
            return;
        }

        setSaving(true);
        try {
            if (category) {
                const response = await categoryService.updateCategory(category._id, {
                    name: name.trim(),
                    color
                });

                if (response.success) {
                    toast.success(t('dashboard.annualReport.categories.success.updated'));
                    onSubmit();
                    onClose();
                }
            } else {
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
            toast.error(category ? t('dashboard.annualReport.categories.errors.updateError') : t('dashboard.annualReport.categories.errors.createError'));
        } finally {
            setSaving(false);
        }
    };

    // Main container for the category form
    return (
        <Box sx={{ p: 3 }}>
            {/* Header section containing the close button and title */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={onClose} sx={{ mr: 2 }}>
                    <span className="material-symbols-rounded">close</span>
                </IconButton>
                <Typography variant="h6">
                    {category ? t('dashboard.annualReport.categories.editCategory') : t('dashboard.annualReport.categories.addFirstCategory')}
                </Typography>
            </Box>

            {/* Form section for category input */}
            <Box component="form" onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
                {/* Input fields for color selection and category name */}
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

                {/* Action buttons for deletion and submission */}
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
                        {saving ? <CircularProgress size={24} /> : (category ? t('dashboard.common.update') : t('dashboard.common.create'))}
                    </Button>
                </Box>
            </Box>

            {/* New section for transactions (only visible in edit mode) */}
            {category && yearsWithData.length > 0 && (
                <Paper elevation={3} sx={{ mt: 3, p: 2, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 2 }}>
                        <FormControl size="small" fullWidth>
                            <InputLabel>{t('dashboard.common.year')}</InputLabel>
                            <Select
                                value={selectedYear}
                                label={t('dashboard.common.year')}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                {yearsWithData.map((year) => (
                                    <MenuItem key={year} value={year}>{year}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Link
                            component="button"
                            onClick={() => setShowTransactions(!showTransactions)}
                            sx={{ textDecoration: 'none' }}
                        >
                            {showTransactions
                                ? t('dashboard.annualReport.categories.form.hideTransactions', { year: selectedYear })
                                : t('dashboard.annualReport.categories.form.showTransactions', { year: selectedYear })}
                        </Link>
                    </Box>

                    {showTransactions && Object.keys(groupedTransactions).length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            {Object.entries(groupedTransactions).map(([month, monthTransactions]) => (
                                <Box key={month} sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" sx={{
                                        mb: 2,
                                        textTransform: 'capitalize',
                                        fontWeight: 600,
                                        color: 'text.secondary'
                                    }}>
                                        {month}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {monthTransactions.map((transaction) => (
                                            <Paper
                                                key={transaction._id}
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    backgroundColor: 'background.default',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    transition: 'background-color 0.2s ease-in-out',
                                                    '&:hover': {
                                                        backgroundColor: 'action.hover'
                                                    }
                                                }}
                                            >
                                                <Box>
                                                    <Typography sx={{ fontWeight: 500 }}>
                                                        {transaction.description || category.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {fromUTCtoLocal(transaction.date).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                                <Typography sx={{
                                                    fontWeight: 600,
                                                    color: transaction.amount >= 0
                                                        ? theme.palette.chart.income
                                                        : theme.palette.chart.expenses,
                                                }}>
                                                    {formatCurrency(transaction.amount, user)}
                                                </Typography>
                                            </Paper>
                                        ))}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Paper>
            )}
        </Box >
    );
}