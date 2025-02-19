import { useState, useEffect, useMemo, forwardRef } from 'react';
import { toast } from 'react-hot-toast';
import { Box, Button, Drawer, TextField, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Fade, Skeleton, Slide, useTheme } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useTranslation } from 'react-i18next';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Services
import { categoryService } from '../../../../../services/category.service';

// Utils
import { formatCurrency, isCurrencyHidden, CURRENCY_VISIBILITY_EVENT } from '../../../../../utils/formatCurrency';

// Types
import type { Category } from '../../../../../types/models/category';
import type { Transaction } from '../../../../../types/models/transaction';
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

// Interface for the props of the AnnualCategories component
interface AnnualCategoriesProps {
    transactions: Transaction[]; // Array of transactions
    loading: boolean; // Loading state
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

// AnnualCategories component
export default function AnnualCategories({ transactions, loading }: AnnualCategoriesProps) {
    const { t } = useTranslation();
    const { user } = useUser();
    const theme = useTheme();

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

    // Fetch all categories from the server
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getAllCategories();
                if (response.success && Array.isArray(response.data)) {
                    setCategories(response.data);
                }
            } catch {
                toast.error(t('dashboard.annualReport.categories.errors.loadingError'));
            }
        };

        fetchCategories();
    }, [t]);

    // Calculate the balance of each category based on transactions
    const categoriesBalance = useMemo(() => {
        if (!categories.length) {
            return [];
        }

        const balances = categories.map(category => {
            const categoryTransactions = transactions.filter(
                transaction => transaction.category === category.name
            );

            const balance = categoryTransactions.reduce((acc, transaction) => {
                return acc + transaction.amount;
            }, 0);

            return {
                category,
                balance
            };
        });

        const filtered = balances
            .filter(item => item.category.name.toLowerCase().includes(searchTerm.toLowerCase()));

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

    // Handle the creation of a new category
    const handleCreateCategory = async () => {
        const categoriesResponse = await categoryService.getAllCategories();
        if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
            setCategories(categoriesResponse.data);
        }
    };

    // Handle the click event on a category to edit it
    const handleCategoryClick = (category: Category) => {
        setEditCategory({
            isOpen: true,
            category,
            name: category.name,
            color: category.color
        });
    };

    // Handle the update of an existing category
    const handleUpdateCategory = async () => {
        const categoriesResponse = await categoryService.getAllCategories();
        if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
            setCategories(categoriesResponse.data);
        }
    };

    // Confirm the deletion of a category
    const confirmDelete = async () => {
        if (!editCategory.category) return;

        setSavingChanges(true);
        try {
            const response = await categoryService.deleteCategory(editCategory.category._id);

            if (response.success) {
                toast.success(t('dashboard.annualReport.categories.success.deleted'));
                const categoriesResponse = await categoryService.getAllCategories();
                if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
                    setCategories(categoriesResponse.data);
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

    // Handle currency visibility changes
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
        // Main container with responsive padding
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Fade animation for the content */}
            <Fade in timeout={500}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Search and sort controls for categories */}
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        mb: 2,
                        flexDirection: { xs: 'column-reverse', sm: 'row' },
                        justifyContent: 'flex-end'
                    }}>
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
                        <Button
                            variant="contained"
                            onClick={() => setDrawerOpen(true)}
                            startIcon={<span className="material-symbols-rounded">add</span>}
                            size="small"
                        >
                            {t('dashboard.annualReport.categories.addCategory')}
                        </Button>
                    </Box>

                    {/* Skeleton loader displayed while loading categories */}
                    {loading ? (
                        <Fade in timeout={300}>
                            <Skeleton variant="rectangular" height={400} sx={{
                                borderRadius: 3,
                                animation: 'pulse 1.5s ease-in-out infinite'
                            }} />
                        </Fade>
                    ) : categories.length === 0 ? (
                        // Banner displayed when there are no categories available
                        <Fade in timeout={300}>
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
                        </Fade>
                    ) : categoriesBalance.length === 0 ? (
                        // Message displayed when no categories match the search term
                        <Fade in timeout={300}>
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
                        </Fade>
                    ) : (
                        // List of categories with their respective balances
                        <Fade in timeout={500}>
                            <List sx={{ width: '100%' }}>
                                {categoriesBalance.map(({ category, balance }) => (
                                    <ListItem
                                        key={category._id}
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
                                        <Box
                                            sx={{
                                                width: { xs: 20, sm: 24 },
                                                height: { xs: 20, sm: 24 },
                                                borderRadius: '50%',
                                                bgcolor: category.color,
                                                flexShrink: 0
                                            }}
                                        />
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
                                        <Box
                                            sx={{
                                                color: balance >= 0 ? theme.palette.chart.income : theme.palette.chart.expenses,
                                                fontWeight: 400,
                                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                                textAlign: 'right',
                                                minWidth: { xs: 80, sm: 120 },
                                                filter: isHidden ? 'blur(8px)' : 'none',
                                                transition: 'filter 0.3s ease',
                                                userSelect: isHidden ? 'none' : 'auto' // Added no-select style when isHidden is true
                                            }}
                                        >
                                            {formatCurrency(balance, user)}
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </Fade>
                    )}
                </Box>
            </Fade>

            {/* Drawer for creating a new category */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        width: { xs: '100%', sm: 450 }
                    }
                }}
            >
                <CategoryForm
                    onSubmit={handleCreateCategory}
                    onClose={() => setDrawerOpen(false)}
                />
            </Drawer>

            {/* Drawer for editing an existing category */}
            <Drawer
                anchor="right"
                open={editCategory.isOpen}
                onClose={() => setEditCategory({ isOpen: false, category: null, name: '', color: '' })}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        width: { xs: '100%', sm: 450 }
                    }
                }}
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
            </Drawer>

            {/* Dialog for confirming category deletion */}
            <Dialog
                open={deleteDialog.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setDeleteDialog({ open: false, categoryName: '' })}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        width: '90%',
                        maxWidth: '400px'
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
        </Box >
    );
}
