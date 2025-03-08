import { useState, forwardRef } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    FormHelperText,
    SelectChangeEvent,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useTranslation } from 'react-i18next';

// Types
import { NotificationType } from '../../../../../types/models/notification';

// Utils
import { prepareForBackend } from '../../../../../utils/dateUtils';

// Transición para el diálogo
const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// Interfaz para los datos del formulario
interface NotificationFormData {
    type: NotificationType;
    targetAudience: 'all' | 'free' | 'paid' | 'specific';
    specificUsers?: string; // IDs de usuarios específicos separados por comas
    title: string;
    message: string;
    content: string;
    scheduledAt: Date | null;
}

export default function NotificationsEditor() {
    const { t } = useTranslation();

    // Estado para los datos del formulario
    const [formData, setFormData] = useState<NotificationFormData>({
        type: 'announcement',
        targetAudience: 'all',
        title: '',
        message: '',
        content: '',
        scheduledAt: null
    });

    // Estado para los errores de validación
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Estado para indicar si está enviando el formulario
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estado para controlar el diálogo de vista previa
    const [previewOpen, setPreviewOpen] = useState(false);

    // Manejador para cambios en campos de texto
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Limpiar error si existe
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Manejador para cambios en selects
    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Limpiar error si existe
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Manejador para cambio de fecha
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateValue = e.target.value ? new Date(e.target.value) : null;
        setFormData(prev => ({ ...prev, scheduledAt: dateValue }));

        // Limpiar error si existe
        if (errors.scheduledAt) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.scheduledAt;
                return newErrors;
            });
        }
    };

    // Validar formulario
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.type) {
            newErrors.type = t('dashboard.notifications.editor.errors.typeRequired');
        }

        if (!formData.targetAudience) {
            newErrors.targetAudience = t('dashboard.notifications.editor.errors.targetRequired');
        }

        if (formData.targetAudience === 'specific' && (!formData.specificUsers || formData.specificUsers.trim() === '')) {
            newErrors.specificUsers = t('dashboard.notifications.editor.errors.specificUsersRequired');
        }

        if (!formData.title || formData.title.trim() === '') {
            newErrors.title = t('dashboard.notifications.editor.errors.titleRequired');
        }

        if (!formData.message || formData.message.trim() === '') {
            newErrors.message = t('dashboard.notifications.editor.errors.messageRequired');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Preparar datos para enviar al backend
            const notificationData = {
                ...formData,
                // Si hay fecha programada, convertirla al formato esperado por el backend
                scheduledAt: formData.scheduledAt ? prepareForBackend(formData.scheduledAt) : undefined
            };

            // Aquí iría la lógica para enviar la notificación
            console.log('Enviando notificación:', notificationData);

            // Simular una petición
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Resetear formulario después de enviar
            setFormData({
                type: 'announcement',
                targetAudience: 'all',
                title: '',
                message: '',
                content: '',
                scheduledAt: null
            });

            // Mostrar mensaje de éxito (aquí se podría usar toast o similar)
            alert(t('dashboard.notifications.editor.success'));
        } catch (error) {
            console.error('Error al enviar notificación:', error);
            // Mostrar mensaje de error
            alert(t('dashboard.notifications.editor.error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Obtener etiqueta para tipo de notificación
    const getNotificationTypeLabel = (type: NotificationType): string => {
        switch (type) {
            case 'tip':
                return t('dashboard.notifications.types.tip');
            case 'announcement':
                return t('dashboard.notifications.types.announcement');
            default:
                return type;
        }
    };

    // Formatear fecha para mostrar en el input
    const formatDateForInput = (date: Date | null): string => {
        if (!date) return '';

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Función para renderizar HTML de forma segura
    const renderHtmlContent = (htmlContent: string) => {
        return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    };

    // Abrir diálogo de vista previa
    const handlePreviewOpen = () => {
        setPreviewOpen(true);
    };

    // Cerrar diálogo de vista previa
    const handlePreviewClose = () => {
        setPreviewOpen(false);
    };

    return (
        <Box sx={{
            height: '100%',
            maxWidth: '100%',
            overflow: 'hidden'
        }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                        {/* Tipo de notificación */}
                        <Box>
                            <FormControl fullWidth error={!!errors.type}>
                                <InputLabel id="notification-type-label">
                                    {t('dashboard.notifications.editor.fields.type.label')}
                                </InputLabel>
                                <Select
                                    labelId="notification-type-label"
                                    id="notification-type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleSelectChange}
                                    label={t('dashboard.notifications.editor.fields.type.label')}
                                >
                                    <MenuItem value="tip">{getNotificationTypeLabel('tip')}</MenuItem>
                                    <MenuItem value="announcement">{getNotificationTypeLabel('announcement')}</MenuItem>
                                </Select>
                                {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
                            </FormControl>
                        </Box>

                        {/* Audiencia objetivo */}
                        <Box>
                            <FormControl fullWidth error={!!errors.targetAudience}>
                                <InputLabel id="target-audience-label">
                                    {t('dashboard.notifications.editor.fields.targetAudience.label')}
                                </InputLabel>
                                <Select
                                    labelId="target-audience-label"
                                    id="target-audience"
                                    name="targetAudience"
                                    value={formData.targetAudience}
                                    onChange={handleSelectChange}
                                    label={t('dashboard.notifications.editor.fields.targetAudience.label')}
                                >
                                    <MenuItem value="all">{t('dashboard.notifications.editor.fields.targetAudience.options.all')}</MenuItem>
                                    <MenuItem value="free">{t('dashboard.notifications.editor.fields.targetAudience.options.free')}</MenuItem>
                                    <MenuItem value="paid">{t('dashboard.notifications.editor.fields.targetAudience.options.paid')}</MenuItem>
                                    <MenuItem value="specific">{t('dashboard.notifications.editor.fields.targetAudience.options.specific')}</MenuItem>
                                </Select>
                                {errors.targetAudience && <FormHelperText>{errors.targetAudience}</FormHelperText>}
                            </FormControl>
                        </Box>

                        {/* Campo para usuarios específicos (solo visible si se selecciona "specific") */}
                        {formData.targetAudience === 'specific' && (
                            <Box sx={{ gridColumn: '1 / -1' }}>
                                <TextField
                                    fullWidth
                                    id="specific-users"
                                    name="specificUsers"
                                    label={t('dashboard.notifications.editor.fields.specificUsers.label')}
                                    value={formData.specificUsers || ''}
                                    onChange={handleTextChange}
                                    error={!!errors.specificUsers}
                                    helperText={errors.specificUsers || t('dashboard.notifications.editor.fields.specificUsers.helper')}
                                />
                            </Box>
                        )}

                        {/* Título */}
                        <Box sx={{ gridColumn: '1 / -1' }}>
                            <TextField
                                fullWidth
                                id="title"
                                name="title"
                                label={t('dashboard.notifications.editor.fields.title.label')}
                                value={formData.title}
                                onChange={handleTextChange}
                                error={!!errors.title}
                                helperText={errors.title}
                            />
                        </Box>

                        {/* Mensaje */}
                        <Box sx={{ gridColumn: '1 / -1' }}>
                            <TextField
                                fullWidth
                                id="message"
                                name="message"
                                label={t('dashboard.notifications.editor.fields.message.label')}
                                value={formData.message}
                                onChange={handleTextChange}
                                multiline
                                rows={2}
                                error={!!errors.message}
                                helperText={errors.message || t('dashboard.notifications.editor.fields.message.helper')}
                            />
                        </Box>

                        {/* Contenido HTML */}
                        <Box sx={{ gridColumn: '1 / -1' }}>
                            <TextField
                                fullWidth
                                id="content"
                                name="content"
                                label={t('dashboard.notifications.editor.fields.content.label')}
                                value={formData.content}
                                onChange={handleTextChange}
                                multiline
                                rows={6}
                                error={!!errors.content}
                                helperText={errors.content || t('dashboard.notifications.editor.fields.content.helper')}
                            />
                        </Box>

                        {/* Fecha de programación */}
                        <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / 2' } }}>
                            <TextField
                                fullWidth
                                id="scheduledAt"
                                name="scheduledAt"
                                label={t('dashboard.notifications.editor.fields.scheduledAt.label')}
                                type="datetime-local"
                                value={formatDateForInput(formData.scheduledAt)}
                                onChange={handleDateChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                helperText={t('dashboard.notifications.editor.fields.scheduledAt.helper')}
                            />
                        </Box>

                        {/* Botones de acción */}
                        <Box sx={{ gridColumn: '1 / -1', mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handlePreviewOpen}
                                disabled={isSubmitting}
                                startIcon={<span className="material-symbols-rounded">visibility</span>}
                            >
                                {t('dashboard.notifications.editor.preview')}
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? t('dashboard.common.sending')
                                    : t('dashboard.notifications.editor.submit')}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            {/* Diálogo de vista previa */}
            <Dialog
                open={previewOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handlePreviewClose}
                maxWidth="md"
                fullWidth
                scroll="paper"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        backgroundColor: 'background.paper'
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    pb: 2,
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    flexShrink: 0
                }}>
                    <Typography variant="h6">
                        {t('dashboard.notifications.editor.previewTitle')}
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{
                    py: 3,
                    px: { xs: 2, sm: 3 },
                    overflowY: 'auto',
                    flexGrow: 1
                }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            {t('dashboard.notifications.editor.previewInfo')}
                        </Typography>
                    </Box>

                    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, mb: 3, overflow: 'visible' }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    wordBreak: 'break-word'
                                }}
                            >
                                {formData.title || t('dashboard.notifications.editor.previewNoTitle')}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Typography
                            variant="body1"
                            paragraph
                            sx={{
                                whiteSpace: 'pre-line',
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word'
                            }}
                        >
                            {formData.message || t('dashboard.notifications.editor.previewNoMessage')}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        {formData.content && (
                            <Box sx={{
                                mt: 2,
                                maxWidth: '100%',
                                overflowX: 'auto',
                                '& a': {
                                    color: 'primary.main',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                },
                                '& img': {
                                    maxWidth: '100%',
                                    height: 'auto',
                                    borderRadius: 1
                                },
                                '& p': {
                                    mb: 1.5,
                                    whiteSpace: 'pre-line',
                                    overflowWrap: 'break-word',
                                    wordBreak: 'break-word'
                                },
                                '& h1, & h2, & h3, & h4, & h5, & h6': {
                                    mt: 2,
                                    mb: 1,
                                    overflowWrap: 'break-word',
                                    wordBreak: 'break-word'
                                },
                                '& ul, & ol': {
                                    pl: 3,
                                    mb: 1.5
                                },
                                '& li': {
                                    mb: 0.5,
                                    overflowWrap: 'break-word',
                                    wordBreak: 'break-word'
                                },
                                '& blockquote': {
                                    borderLeft: '4px solid',
                                    borderColor: 'divider',
                                    pl: 2,
                                    py: 1,
                                    my: 2,
                                    fontStyle: 'italic',
                                    overflowWrap: 'break-word',
                                    wordBreak: 'break-word'
                                },
                                '& pre, & code': {
                                    fontFamily: 'monospace',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                    backgroundColor: 'action.hover',
                                    p: 1,
                                    borderRadius: 1,
                                    maxWidth: '100%',
                                    overflowX: 'auto'
                                },
                                '& *': {
                                    maxWidth: '100%'
                                }
                            }}>
                                <div style={{
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                    width: '100%'
                                }}>
                                    {renderHtmlContent(formData.content)}
                                </div>
                            </Box>
                        )}

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle2" color="text.secondary">
                            {t('dashboard.notifications.editor.previewTargetAudience')}:
                            <Typography component="span" fontWeight="bold" sx={{ ml: 1 }}>
                                {t(`dashboard.notifications.editor.fields.targetAudience.options.${formData.targetAudience}`)}
                            </Typography>
                        </Typography>

                        {formData.scheduledAt && (
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                                {t('dashboard.notifications.editor.previewScheduledFor')}:
                                <Typography component="span" fontWeight="bold" sx={{ ml: 1 }}>
                                    {formData.scheduledAt.toLocaleString()}
                                </Typography>
                            </Typography>
                        )}
                    </Paper>


                </DialogContent>
                <DialogActions sx={{
                    px: 3,
                    py: 2,
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 1,
                    flexShrink: 0,
                    mt: 'auto'
                }}>
                    <Button
                        onClick={handlePreviewClose}
                    >
                        {t('dashboard.common.close')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
