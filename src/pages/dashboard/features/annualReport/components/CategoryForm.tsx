/**
 * CategoryForm Module
 * 
 * Provides an interface for creating and editing transaction categories.
 * 
 * Features:
 * - Category name, color and icon selection with visual preview
 * - Responsive design optimized for different screen sizes
 * - Category deletion with appropriate safeguards
 * - Simple and focused form for category management
 * 
 * @module CategoryForm
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
    IconButton,
    Card,
    CardContent
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { X, Edit, Trash2, Plus } from 'react-feather';

// Services
import { categoryService } from '../../../../../services/category.service';

// Types
import type { Category } from '../../../../../types/supabase/categories';

// Utils
import { COMMON_CATEGORY_ICONS, IconWithLibrary } from '../../../../../utils/iconsUtils';

// Material Icons
import * as MaterialIcons from '@mui/icons-material';

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
 * name, color and icon selection.
 * 
 * @param {CategoryFormProps} props - Component properties
 * @returns {JSX.Element} Rendered form component
 */
export default function CategoryForm({ category, onSubmit, onClose, onDelete }: CategoryFormProps) {
    const { t } = useTranslation();

    // Form state
    const [name, setName] = useState(category?.name || '');
    const [color, setColor] = useState(category?.color || '#ff8e38');
    const [selectedIcon, setSelectedIcon] = useState<IconWithLibrary>(COMMON_CATEGORY_ICONS[0]);
    const [saving, setSaving] = useState(false);

    // Initialize category data
    useEffect(() => {
        if (category) {
            setName(category.name);
            setColor(category.color);

            // Find the icon in the available icons list
            const foundIcon = COMMON_CATEGORY_ICONS.find(
                icon => icon.name === category.icon
            );
            if (foundIcon) {
                setSelectedIcon(foundIcon);
            }
        }
    }, [category]);

    /**
     * Handle form submission for creating or updating a category
     * Validates inputs and makes appropriate API calls
     */
    const handleSubmit = useCallback(async () => {
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
                    color,
                    icon: selectedIcon.name
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
                    color,
                    icon: selectedIcon.name
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
    }, [name, color, selectedIcon, category, t, onSubmit, onClose]);

    /**
     * Creates action buttons for external use
     */
    const actionButtons = useMemo(() => (
        <Box sx={{ display: 'flex', gap: 2 }}>
            {category && onDelete && (
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Trash2 size={20} color="currentColor" />}
                    onClick={onDelete}
                    disabled={saving}
                    fullWidth
                >
                    {t('dashboard.common.delete')}
                </Button>
            )}
            <Button
                variant="contained"
                startIcon={category ? <Edit size={20} color="currentColor" /> : <Plus size={20} color="currentColor" />}
                onClick={handleSubmit}
                disabled={saving}
                fullWidth
            >
                {saving ? <CircularProgress size={24} /> :
                    (category ? t('dashboard.common.update') : t('dashboard.common.create'))}
            </Button>
        </Box>
    ), [category, onDelete, saving, t, handleSubmit]);


    /**
     * Get Material Icon component by name
     */
    const getMaterialIconComponent = (iconName: string) => {
        // Convert kebab-case to PascalCase for MUI icons
        const pascalCaseName = iconName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');

        return (MaterialIcons as Record<string, React.ComponentType>)[pascalCaseName];
    };

    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Form header with title and close button */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={onClose} sx={{ mr: 2 }}>
                    <X size={20} color="currentColor" />
                </IconButton>
                <Typography variant="h6">
                    {category
                        ? t('dashboard.annualReport.categories.editCategory')
                        : t('dashboard.annualReport.categories.addFirstCategory')}
                </Typography>
            </Box>

            {/* Category form */}
            <Box
                component="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                sx={{ flex: 1, overflow: 'auto' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Category name section */}
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                {t('dashboard.annualReport.categories.form.categoryName')}
                            </Typography>
                            <TextField
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                fullWidth
                                size="small"
                                placeholder="Ej: Alimentación, Transporte..."
                            />
                        </CardContent>
                    </Card>

                    {/* Color selection section */}
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                {t('dashboard.annualReport.categories.form.selectColor')}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    style={{
                                        width: '60px',
                                        height: '40px',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                />
                                <TextField
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    size="small"
                                    sx={{ flex: 1 }}
                                />
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Icon selection section */}
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                {t('dashboard.annualReport.categories.form.selectIcon')}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 1
                                }}
                            >
                                {COMMON_CATEGORY_ICONS.map((icon) => {
                                    const isSelected = selectedIcon.name === icon.name;
                                    const IconComponent = getMaterialIconComponent(icon.name);

                                    return (
                                        <Box key={icon.name}>
                                            <IconButton
                                                onClick={() => setSelectedIcon(icon)}
                                                sx={{
                                                    width: 50,
                                                    height: 50,
                                                    border: isSelected ? 2 : 1,
                                                    borderColor: isSelected ? 'primary.main' : 'divider',
                                                    backgroundColor: isSelected ? 'primary.main' + '20' : 'transparent',
                                                    '&:hover': {
                                                        backgroundColor: isSelected ? 'primary.main' + '30' : 'action.hover'
                                                    }
                                                }}
                                            >
                                                {IconComponent ? (
                                                    <Box sx={{ color: isSelected ? 'primary.main' : 'text.secondary' }}>
                                                        <IconComponent />
                                                    </Box>
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            width: 20,
                                                            height: 20,
                                                            backgroundColor: isSelected ? 'primary.main' : 'text.secondary',
                                                            borderRadius: '2px'
                                                        }}
                                                    />
                                                )}
                                            </IconButton>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Action buttons at the bottom */}
            <Box sx={{
                mt: 2,
            }}>
                {actionButtons}
            </Box>
        </Box>
    );
}