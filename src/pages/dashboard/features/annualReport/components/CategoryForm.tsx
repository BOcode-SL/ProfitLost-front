import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import { toast } from 'react-hot-toast';
import IconButton from '@mui/material/IconButton';

import { categoryService } from '../../../../../services/category.service';
import type { Category } from '../../../../../types/models/category.modelTypes';

interface CategoryFormProps {
    category?: Category;
    onSubmit: () => void;
    onClose: () => void;
    onDelete?: () => void;
}

export default function CategoryForm({ category, onSubmit, onClose, onDelete }: CategoryFormProps) {
    const [name, setName] = useState(category?.name || '');
    const [color, setColor] = useState(category?.color || '#ff8e38');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error('Category name is required');
            return;
        }

        setSaving(true);
        try {
            if (category) {
                // Update
                const response = await categoryService.updateCategory(category._id, {
                    name: name.trim(),
                    color
                });

                if (response.success) {
                    toast.success('Category updated successfully');
                    onSubmit();
                    onClose();
                }
            } else {
                // Create
                const response = await categoryService.createCategory({
                    name: name.trim(),
                    color
                });

                if (response.success) {
                    toast.success('Category created successfully');
                    onSubmit();
                    onClose();
                }
            }
        } catch {
            toast.error(category ? 'Failed to update category' : 'Failed to create category');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={onClose} sx={{ mr: 2 }}>
                    <span className="material-symbols-rounded">close</span>
                </IconButton>
                <Typography variant="h6">
                    {category ? 'Edit Category' : 'Add your first category'}
                </Typography>
            </Box>

            <Box component="form" onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
                <Paper
                    elevation={2}
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
                        label="Category Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        size="small"
                    />
                </Paper>

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    {category && onDelete && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={onDelete}
                            disabled={saving}
                            fullWidth
                        >
                            Delete
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={saving}
                        fullWidth
                    >
                        {saving ? <CircularProgress size={24} /> : (category ? 'Save Changes' : 'Create')}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}