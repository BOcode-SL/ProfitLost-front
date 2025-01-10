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

import { useUser } from '../../../../../contexts/UserContext';
import { categoryService } from '../../../../../services/category.service';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import type { Category } from '../../../../../types/models/category.modelTypes';
import type { Transaction } from '../../../../../types/models/transaction.modelTypes';

interface AnnualCategoriesProps {
    transactions: Transaction[];
    loading: boolean;
}

type SortOption = 'name_asc' | 'name_desc' | 'balance_asc' | 'balance_desc';

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
                setNewCategory({ name: '', color: '#000000' });
                // Reload categories
                const categoriesResponse = await categoryService.getAllCategories();
                if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
                    setCategories(categoriesResponse.data);
                }
            }
        } catch {
            toast.error('Error creating category');
        } finally {
            setSavingCategory(false);
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
                    setNewCategory({ name: '', color: '#ff8e38' }); // Limpiar el contenido del input al cerrar
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
                            setNewCategory({ name: '', color: '#ff8e38' }); // Limpiar el contenido del input al cerrar
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
                                p: 1,
                                borderRadius: 3,
                            }}>
                            <input
                                type="color"
                                value={newCategory.color}
                                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                                style={{ width: '60px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            />
                        </Paper>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 1,
                                borderRadius: 3,
                                width: '100%'
                            }}>
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
                            height: '45px'
                        }}
                    >
                        {savingCategory ? <CircularProgress size={24} /> : 'Save Category'}
                    </Button>
                </Box>
            </Drawer>
        </Box>
    );
}
