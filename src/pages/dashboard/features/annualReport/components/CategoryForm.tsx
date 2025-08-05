/**
 * CategoryForm Module
 * 
 * Provides an interface for creating and editing transaction categories.
 * 
 * Features:
 * - Category name and color selection with visual preview
 * - Responsive design optimized for different screen sizes
 * - Category deletion with appropriate safeguards
 * - Simple and focused form for category management
 * 
 * @module CategoryForm
 */
import { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
    Paper,
    IconButton
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';

// Services
import { categoryService } from '../../../../../services/category.service';

// Types
import type { Category } from '../../../../../types/supabase/categories';

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

    // Form state
    const [name, setName] = useState(category?.name || '');
    const [color, setColor] = useState(category?.color || '#ff8e38');
    const [saving, setSaving] = useState(false);



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
        </Box>
    );
}