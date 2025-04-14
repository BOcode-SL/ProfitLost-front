/**
 * AnnualCategories Component
 * 
 * Displays and manages transaction categories with their yearly balances.
 * Features include:
 * - Category list with balance totals
 * - Sorting options (name or balance, ascending or descending)
 * - Search functionality to filter categories
 * - Category creation, editing, and deletion
 * - Balance visibility toggle for privacy
 * - Color-coded indicators for income vs expense categories
 * - Responsive layout for different screen sizes
 */
import React, { useState, useEffect, useMemo, forwardRef } from 'react';
import { toast } from 'react-hot-toast';
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide,
    useTheme,
    Divider
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Services
import { categoryService } from '../../../../../services/category.service';

// Utils
import { formatCurrency, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../../../utils/currencyUtils';

// Types
import type { Category } from '../../../../../types/supabase/categories';
import type { Transaction } from '../../../../../types/supabase/transactions';
import type { CategoryApiErrorResponse } from '../../../../../types/api/responses';

type SortOption = 'name_asc' | 'name_desc' | 'balance_asc' | 'balance_desc';
interface EditCategoryState {
    isOpen: boolean;
    category: Category | null;
    name: string;
    color: string;
}

// Components
import CategoryForm from './CategoryForm';
import DrawerBase from '../../../components/ui/DrawerBase';

// Interface for the props of the AnnualCategories component
interface AnnualCategoriesProps {
    transactions: Transaction[];
    isLoading: boolean; // Loading state indicator
}

// Transition component for dialog animations
const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AnnualCategories({ transactions, isLoading }: AnnualCategoriesProps) {
    const { t } = useTranslation();
    const { user } = useUser();
    const theme = useTheme();

    // State management
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState<SortOption>('name_asc');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editCategory, setEditCategory] = useState<EditCategoryState>({
        isOpen: false,
        category: null,
        name: '',
        color: ''
    });
    const [savingChanges, setSavingChanges] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        categoryName: ''
    });
    const [isHidden, setIsHidden] = useState(isCurrencyHidden());
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

    // Fetch all categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            setIsCategoriesLoading(true);
            try {
                const response = await categoryService.getAllCategories();
                if (response.success && Array.isArray(response.data)) {
                    setCategories(response.data as Category[]);
                }
            } catch {
                toast.error(t('dashboard.annualReport.categories.errors.loadingError'));
            } finally {
                setIsCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, [t]);

    // Calculate the balance for each category based on transactions
    const categoriesBalance = useMemo(() => {
        if (!categories.length) {
            return [];
        }

        // Calculate balance for each category
        const balances = categories.map(category => {
            // Filter transactions for this category
            const categoryTransactions = transactions.filter(transaction => 
                transaction.category_id === category.id
            );

            // Calculate balance by summing transaction amounts
            const balance = categoryTransactions.reduce((acc, transaction) => 
                acc + transaction.amount, 0
            );

            return {
                category,
                balance
            };
        });

        // Apply search filter
        const filtered = balances
            .filter(item => item.category.name.toLowerCase().includes(searchTerm.toLowerCase()));

        // Apply selected sort option
        return filtered.sort((a, b) => {
            switch (sortOption) {
                case 'name_asc':
                    return a.category.name.localeCompare(b.category.name);
                case 'name_desc':
                    return b.category.name.localeCompare(a.category.name);
                case 'balance_asc':
                    return a.balance - b.balance;
                case 'balance_desc':
                    return b.balance - a.balance;
                default:
                    return 0;
            }
        });
    }, [categories, transactions, searchTerm, sortOption]);

    // Handler for category creation
    const handleCreateCategory = async () => {
        const categoriesResponse = await categoryService.getAllCategories();
        if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
            setCategories(categoriesResponse.data as Category[]);
        }
    };

    // Handler for category selection to edit
    const handleCategoryClick = (category: Category) => {
        setEditCategory({
            isOpen: true,
            category,
            name: category.name,
            color: category.color
        });
    };

    // Handler for category update
    const handleUpdateCategory = async () => {
        const categoriesResponse = await categoryService.getAllCategories();
        if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
            setCategories(categoriesResponse.data as Category[]);
        }
    };

    // Handler for category deletion with error handling
    const confirmDelete = async () => {
        if (!editCategory.category) return;

        setSavingChanges(true);
        try {
            const categoryId = editCategory.category.id;
            const response = await categoryService.deleteCategory(categoryId);

            if (response.success) {
                toast.success(t('dashboard.annualReport.categories.success.deleted'));
                const categoriesResponse = await categoryService.getAllCategories();
                if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
                    setCategories(categoriesResponse.data as Category[]);
                }
                setEditCategory({ isOpen: false, category: null, name: '', color: '' });
            }
        } catch (error: unknown) {
            const categoryError = error as CategoryApiErrorResponse;
            switch (categoryError.error) {
                case 'CATEGORY_IN_USE':
                    toast.error(t('dashboard.common.error.CATEGORY_IN_USE'));
                    break;
                case 'CATEGORY_NOT_FOUND':
                    toast.error(t('dashboard.common.error.CATEGORY_NOT_FOUND'));
                    break;
                case 'INVALID_ID_FORMAT':
                    toast.error(t('dashboard.common.error.INVALID_ID_FORMAT'));
                    break;
                default:
                    toast.error(t('dashboard.common.error.DELETE_ERROR'));
            }
        } finally {
            setSavingChanges(false);
            setDeleteDialog({ open: false, categoryName: '' });
        }
    };

    // Listen for currency visibility toggle events
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

    return (
        <>
            {/* Main container */}
            <Box sx={{ p: { xs: 1, sm: 2 } }}>
                {/* Category controls: search, sort, and add button */}
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 2,
                    flexDirection: { xs: 'column-reverse', sm: 'row' },
                    justifyContent: 'flex-end'
                }}>
                    {/* Search field for filtering categories */}
                    <TextField
                        size="small"
                        placeholder={t('dashboard.annualReport.categories.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            minWidth: { xs: '100%', sm: 200 },
                            height: '35px',
                            '& .MuiInputBase-root': {
                                height: '35px'
                            }
                        }}
                    />
                    {/* Sort options dropdown */}
                    <FormControl
                        size="small"
                        sx={{
                            minWidth: { xs: '100%', sm: 200 },
                            height: '35px',
                            '& .MuiInputBase-root': {
                                height: '35px'
                            }
                        }}>
                        <InputLabel>{t('dashboard.annualReport.categories.sort.label')}</InputLabel>
                        <Select
                            size="small"
                            label={t('dashboard.annualReport.categories.sort.label')}
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value as SortOption)}
                        >
                            <MenuItem value="name_asc">{t('dashboard.annualReport.categories.sort.nameAsc')}</MenuItem>
                            <MenuItem value="name_desc">{t('dashboard.annualReport.categories.sort.nameDesc')}</MenuItem>
                            <MenuItem value="balance_desc">{t('dashboard.annualReport.categories.sort.balanceDesc')}</MenuItem>
                            <MenuItem value="balance_asc">{t('dashboard.annualReport.categories.sort.balanceAsc')}</MenuItem>
                        </Select>
                    </FormControl>
                    {/* Add category button */}
                    <Button
                        variant="contained"
                        onClick={() => setDrawerOpen(true)}
                        startIcon={<AddIcon />}
                        size="small"
                    >
                        {t('dashboard.annualReport.categories.addCategory')}
                    </Button>
                </Box>

                {/* Loading, empty state, or category list display */}
                {isLoading || isCategoriesLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : categories.length === 0 ? (
                    // Empty state when no categories exist
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 3,
                        minHeight: 200
                    }}>
                        <Typography variant="h5" color="text.secondary">
                            {t('dashboard.annualReport.categories.addCategoryBanner')}
                        </Typography>
                    </Box>
                ) : categoriesBalance.length === 0 ? (
                    // Empty search results message
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 3,
                        minHeight: 200
                    }}>
                        <Typography variant="h5" color="text.secondary">
                            🔍 {t('dashboard.annualReport.categories.noCategoriesFound')} "{searchTerm}" 🔍
                        </Typography>
                    </Box>
                ) : (
                    // Category list with balances
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                    }}>
                        {categoriesBalance.map(({ category, balance }) => (
                            <React.Fragment key={category.id}>
                                <ListItem
                                    onClick={() => handleCategoryClick(category)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        py: 1.5,
                                        px: { xs: 1, sm: 2 },
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s ease',
                                        '&:hover': {
                                            bgcolor: `${category.color}20`
                                        }
                                    }}
                                >
                                    {/* Category color indicator */}
                                    <Box
                                        sx={{
                                            width: { xs: 20, sm: 24 },
                                            height: { xs: 20, sm: 24 },
                                            borderRadius: '50%',
                                            bgcolor: category.color,
                                            flexShrink: 0
                                        }}
                                    />
                                    {/* Category name */}
                                    <ListItemText
                                        primary={category.name}
                                        sx={{
                                            flex: 1,
                                            '& .MuiListItemText-primary': {
                                                fontWeight: 400,
                                                fontSize: { xs: '0.9rem', sm: '1rem' }
                                            }
                                        }}
                                    />
                                    {/* Category balance with privacy support */}
                                    <Box
                                        sx={{
                                            color: balance >= 0 ? theme.palette.chart.income : theme.palette.chart.expenses,
                                            fontWeight: 400,
                                            fontSize: { xs: '0.9rem', sm: '1rem' },
                                            textAlign: 'right',
                                            minWidth: { xs: 80, sm: 120 },
                                            filter: isHidden ? 'blur(8px)' : 'none',
                                            transition: 'filter 0.3s ease',
                                            userSelect: isHidden ? 'none' : 'auto'
                                        }}
                                    >
                                        {formatCurrency(balance, user)}
                                    </Box>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </Box>
                )}

                {/* Category creation drawer */}
                <DrawerBase
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                >
                    <CategoryForm
                        onSubmit={handleCreateCategory}
                        onClose={() => setDrawerOpen(false)}
                    />
                </DrawerBase>

                {/* Category editing drawer */}
                <DrawerBase
                    open={editCategory.isOpen}
                    onClose={() => setEditCategory({ isOpen: false, category: null, name: '', color: '' })}
                >
                    <CategoryForm
                        category={editCategory.category || undefined}
                        onSubmit={handleUpdateCategory}
                        onClose={() => setEditCategory({ isOpen: false, category: null, name: '', color: '' })}
                        onDelete={() => {
                            if (editCategory.category) {
                                setDeleteDialog({
                                    open: true,
                                    categoryName: editCategory.category.name
                                });
                            }
                        }}
                    />
                </DrawerBase>

                {/* Category deletion confirmation dialog */}
                <Dialog
                    open={deleteDialog.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setDeleteDialog({ open: false, categoryName: '' })}
                    slotProps={{
                        paper: {
                            sx: {
                                borderRadius: 3,
                                width: '90%',
                                maxWidth: '400px'
                            }
                        }
                    }}
                >
                    <DialogTitle sx={{
                        textAlign: 'center',
                        pt: 3,
                        pb: 1
                    }}>
                        {t('dashboard.annualReport.categories.delete.title')}
                    </DialogTitle>
                    <DialogContent sx={{
                        textAlign: 'center',
                        py: 2
                    }}>
                        <Typography>
                            {t('dashboard.annualReport.categories.delete.confirmMessage')}
                            <Typography component="span" fontWeight="bold" color="primary">
                                {deleteDialog.categoryName}
                            </Typography>
                            ?
                        </Typography>
                        <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
                            {t('dashboard.annualReport.categories.delete.warning')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {t('dashboard.annualReport.categories.delete.cannotUndo')}
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{
                        justifyContent: 'center',
                        gap: 2,
                        p: 3
                    }}>
                        <Button
                            variant="outlined"
                            onClick={() => setDeleteDialog({ open: false, categoryName: '' })}
                            sx={{
                                width: '120px'
                            }}
                        >
                            {t('dashboard.common.cancel')}
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={confirmDelete}
                            disabled={savingChanges}
                            sx={{
                                width: '120px'
                            }}
                        >
                            {savingChanges ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                t('dashboard.common.delete')
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
}
