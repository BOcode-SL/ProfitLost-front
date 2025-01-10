import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef } from 'react';

import { useUser } from '../../../../../contexts/UserContext';
import { categoryService } from '../../../../../services/category.service';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import type { Category } from '../../../../../types/models/category.modelTypes';
import type { Transaction } from '../../../../../types/models/transaction.modelTypes';
import { CategoryApiErrorResponse } from '../../../../../types/services/category.serviceTypes';

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
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState<SortOption>('name_asc');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: '',
        color: '#ff8e38'
    });
    const [savingCategory, setSavingCategory] = useState(false);
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
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const categoriesBalance = useMemo(() => {
        const balances = categories.map(category => {
            const balance = transactions
                .filter(transaction => transaction.category === category._id)
                .reduce((acc, transaction) => acc + transaction.amount, 0);

            return {
                category,
                balance
            };
        });

        // Filter by search
        const filtered = balances.filter(item =>
            item.category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

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
        if (!newCategory.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        setSavingCategory(true);
        try {
            const response = await categoryService.createCategory({
                name: newCategory.name,
                color: newCategory.color
            });

            if (response.success) {
                toast.success('Category created successfully');
                setDrawerOpen(false);
                setNewCategory({ name: '', color: '#ff8e38' });
                const categoriesResponse = await categoryService.getAllCategories();
                if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
                    setCategories(categoriesResponse.data);
                }
            }
        } catch (error: unknown) {
            if ((error as CategoryApiErrorResponse).error === 'DUPLICATE_CATEGORY') {
                toast.error('A category with this name already exists');
            } else if ((error as CategoryApiErrorResponse).error === 'MISSING_FIELDS') {
                toast.error('Please fill in all required fields');
            } else {
                toast.error('Error creating category');
            }
        } finally {
            setSavingCategory(false);
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
        if (!editCategory.category || !editCategory.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        setSavingChanges(true);
        try {
            const response = await categoryService.updateCategory(editCategory.category._id, {
                name: editCategory.name,
                color: editCategory.color
            });

            if (response.success) {
                toast.success('Category updated successfully');
                const categoriesResponse = await categoryService.getAllCategories();
                if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
                    setCategories(categoriesResponse.data);
                }
                setEditCategory({ isOpen: false, category: null, name: '', color: '' });
            }
        } catch (error: unknown) {
            if ((error as CategoryApiErrorResponse).error === 'DUPLICATE_CATEGORY') {
                toast.error('A category with this name already exists');
            } else if ((error as CategoryApiErrorResponse).error === 'NOT_FOUND') {
                toast.error('Category not found');
            } else if ((error as CategoryApiErrorResponse).error === 'MISSING_FIELDS') {
                toast.error('Please fill in all required fields');
            } else {
                toast.error('Error updating category');
            }
        } finally {
            setSavingChanges(false);
        }
    };

    const handleDeleteCategory = async () => {
        if (!editCategory.category) return;

        setDeleteDialog({
            open: true,
            categoryName: editCategory.category.name
        });
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
                case 'NOT_FOUND':
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

    if (loading || loadingCategories) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>

            <Box sx={{
                display: 'flex',
                gap: 2,
                mb: 2,
                flexDirection: { xs: 'column', sm: 'row' },
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
                        value={sortOption}
                        label="Sort by"
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
                    sx={{
                        px: 2,
                        py: 1,
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        height: '35px'
                    }}
                >
                    New Category
                </Button>
            </Box>

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

            <Drawer
                open={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setNewCategory({ name: '', color: '#ff8e38' });
                }}
                anchor="right"
                PaperProps={{
                    sx: {
                        width: {
                            xs: '100%',
                            sm: 450
                        },
                        bgcolor: 'background.default',
                        p: 2
                    }
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3
                }}>
                    <IconButton
                        onClick={() => {
                            setDrawerOpen(false);
                            setNewCategory({ name: '', color: '#ff8e38' });
                        }}
                        sx={{ mr: 2 }}
                    >
                        <span className="material-symbols-rounded">close</span>
                    </IconButton>
                    <Typography variant="h6">New Category</Typography>
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    gap: 2,
                    px: 3
                }}>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: '100%'
                        }}
                    >
                        <Paper
                            elevation={2}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                width: '100%',
                                p: 2,
                                borderRadius: 3,
                            }}>
                            <input
                                type="color"
                                value={newCategory.color}
                                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                                style={{ width: '60px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            />
                            <TextField
                                label="Category Name"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                fullWidth
                                size="small"
                            />
                        </Paper>
                    </Box>

                    <Button
                        variant="contained"
                        onClick={handleCreateCategory}
                        disabled={savingCategory}
                        sx={{
                            mt: 2,
                            width: '100%',
                        }}
                    >
                        {savingCategory ? <CircularProgress size={24} /> : 'Save Category'}
                    </Button>
                </Box>
            </Drawer>

            <Drawer
                anchor="right"
                open={editCategory.isOpen}
                onClose={() => setEditCategory({ isOpen: false, category: null, name: '', color: '' })}
                PaperProps={{
                    sx: {
                        width: {
                            xs: '100%',
                            sm: 450
                        },
                        bgcolor: 'background.default',
                        p: 2
                    }
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton
                        onClick={() => setEditCategory({ isOpen: false, category: null, name: '', color: '' })}
                        sx={{ mr: 2 }}
                    >
                        <span className="material-symbols-rounded">close</span>
                    </IconButton>
                    <Typography variant="h6">Edit Category</Typography>
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    px: 3
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        width: '100%'
                    }}>
                        <Paper
                            elevation={2}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                width: '100%',
                                p: 2,
                                borderRadius: 3,
                            }}>
                            <input
                                type="color"
                                value={editCategory.color}
                                onChange={(e) => setEditCategory(prev => ({ ...prev, color: e.target.value }))}
                                style={{ width: '60px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            />
                            <TextField
                                label="Category Name"
                                value={editCategory.name}
                                onChange={(e) => setEditCategory(prev => ({ ...prev, name: e.target.value }))}
                                fullWidth
                                size="small"
                            />
                        </Paper>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleDeleteCategory}
                            disabled={savingChanges}
                            fullWidth
                            sx={{ height: '45px' }}
                        >
                            Delete
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleUpdateCategory}
                            disabled={savingChanges}
                            fullWidth
                            sx={{ height: '45px' }}
                        >
                            {savingChanges ? <CircularProgress size={24} /> : 'Save Changes'}
                        </Button>
                    </Box>
                </Box>
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
                            width: '120px',
                            height: '45px'
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
                            width: '120px',
                            height: '45px'
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
        </Box>
    );
}
