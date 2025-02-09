import { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Paper, IconButton } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// Services
import { categoryService } from '../../../../../services/category.service';

// Types
import type { Category } from '../../../../../types/models/category';

// Interface for the props of the CategoryForm component
// Interface for the props of the CategoryForm component
interface CategoryFormProps {
    category?: Category; // Optional category prop
    onSubmit: () => void; // Function to call on form submission
    onClose: () => void; // Function to call to close the form
    onDelete?: () => void; // Optional function to call on delete
}

// CategoryForm component
export default function CategoryForm({ category, onSubmit, onClose, onDelete }: CategoryFormProps) {
    const { t } = useTranslation();

    const [name, setName] = useState(category?.name || '');
    const [color, setColor] = useState(category?.color || '#ff8e38');
    const [saving, setSaving] = useState(false);

    // Handle the submit of the form
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
            {/* Header section with close button and title */}
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
                {/* Input fields for color and category name */}
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

                {/* Action buttons for delete and submit */}
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
        </Box>
    );
}