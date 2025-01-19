import { useState, useEffect, useMemo, forwardRef } from 'react';
import { toast } from 'react-hot-toast';
import {
    Box, Button, Drawer, TextField, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Fade, Skeleton, Slide
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

import { useUser } from '../../../../../contexts/UserContext';
import { categoryService } from '../../../../../services/category.service';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import type { Category } from '../../../../../types/models/category';
import type { Transaction } from '../../../../../types/models/transaction';
import { CategoryApiErrorResponse } from '../../../../../types/api/responses';
import CategoryForm from './CategoryForm';

interface AnnualCategoriesProps {
    transactions: Transaction[];
    loading: boolean;
}

type SortOption = 'name_asc' | 'name_desc' | 'balance_asc' | 'balance_desc';

interface EditCategoryState {
    isOpen: boolean;
    category: Category | null;
    name: string;
    color: string;
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AnnualCategories({ transactions, loading }: AnnualCategoriesProps) {
    const { user } = useUser();
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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getAllCategories();
                if (response.success && Array.isArray(response.data)) {
                    setCategories(response.data);
                }
            } catch {
                toast.error('Error loading categories');
            }
        };

        fetchCategories();
    }, []);

    const categoriesBalance = useMemo(() => {
        if (!categories.length) {
            return [];
        }

        const balances = categories.map(category => {
            // Filter transactions for this category
            const categoryTransactions = transactions.filter(
                transaction => transaction.category === category.name
            );

            // Calculate total balance (income - expenses)
            const balance = categoryTransactions.reduce((acc, transaction) => {
                return acc + transaction.amount;
            }, 0);

            return {
                category,
                balance
            };
        });

        // Filter by search
        const filtered = balances
            .filter(item => item.category.name.toLowerCase().includes(searchTerm.toLowerCase()));

        // Sort by selected option
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

    const handleCreateCategory = async () => {
        const categoriesResponse = await categoryService.getAllCategories();
        if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
            setCategories(categoriesResponse.data);
        }
    };

    const handleCategoryClick = (category: Category) => {
        setEditCategory({
            isOpen: true,
            category,
            name: category.name,
            color: category.color
        });
    };

    const handleUpdateCategory = async () => {
        const categoriesResponse = await categoryService.getAllCategories();
        if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
            setCategories(categoriesResponse.data);
        }
    };

    const confirmDelete = async () => {
        if (!editCategory.category) return;

        setSavingChanges(true);
        try {
            const response = await categoryService.deleteCategory(editCategory.category._id);

            if (response.success) {
                toast.success('Category deleted successfully');
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
                    toast.error('Cannot delete a category with associated transactions');
                    break;
                case 'CATEGORY_NOT_FOUND':
                    toast.error('Category not found');
                    break;
                case 'INVALID_ID_FORMAT':
                    toast.error('Invalid category format');
                    break;
                default:
                    toast.error('Error deleting category');
            }
        } finally {
            setSavingChanges(false);
            setDeleteDialog({ open: false, categoryName: '' });
        }
    };

    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            <Fade in timeout={500}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        mb: 2,
                        flexDirection: { xs: 'column-reverse', sm: 'row' },
                        justifyContent: 'flex-end'
                    }}>
                        <TextField
                            size="small"
                            placeholder="Find category..."
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
                            <InputLabel>Sort by</InputLabel>
                            <Select
                                size="small"
                                label="Sort by"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value as SortOption)}
                            >
                                <MenuItem value="name_asc">Name (A-Z)</MenuItem>
                                <MenuItem value="name_desc">Name (Z-A)</MenuItem>
                                <MenuItem value="balance_desc">Balance (Higher)</MenuItem>
                                <MenuItem value="balance_asc">Balance (Lower)</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            onClick={() => setDrawerOpen(true)}
                            startIcon={<span className="material-symbols-rounded">add</span>}
                            size="small"
                        >
                            New Category
                        </Button>
                    </Box>

                    {loading ? (
                        <Fade in timeout={300}>
                            <Skeleton variant="rectangular" height={400} sx={{
                                borderRadius: 3,
                                animation: 'pulse 1.5s ease-in-out infinite'
                            }} />
                        </Fade>
                    ) : (
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
                                                color: balance >= 0 ? 'success.main' : 'error.main',
                                                fontWeight: 400,
                                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                                textAlign: 'right',
                                                minWidth: { xs: 80, sm: 120 }
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

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        width: { xs: '100%', sm: 450 },
                        bgcolor: 'background.default'
                    }
                }}
            >
                <CategoryForm
                    onSubmit={handleCreateCategory}
                    onClose={() => setDrawerOpen(false)}
                />
            </Drawer>

            <Drawer
                anchor="right"
                open={editCategory.isOpen}
                onClose={() => setEditCategory({ isOpen: false, category: null, name: '', color: '' })}
                PaperProps={{
                    sx: {
                        width: { xs: '100%', sm: 450 },
                        bgcolor: 'background.default'
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
                    Delete Category
                </DialogTitle>
                <DialogContent sx={{
                    textAlign: 'center',
                    py: 2
                }}>
                    <Typography>
                        Are you sure you want to delete the category{' '}
                        <Typography component="span" fontWeight="bold" color="primary">
                            {deleteDialog.categoryName}
                        </Typography>
                        ?
                    </Typography>
                    <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
                        Note: Categories with associated transactions cannot be deleted.
                        You must first reassign or delete those transactions.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        This action cannot be undone.
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
                        Cancel
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
                            'Delete'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
}
