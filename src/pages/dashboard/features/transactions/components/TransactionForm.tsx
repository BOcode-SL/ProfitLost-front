/**
 * TransactionForm Component
 * 
 * Provides a form interface for creating and editing financial transactions.
 * Features include:
 * - Date, amount, category, and description management
 * - Income/expense type selection with appropriate styling
 * - Recurring transaction support with different frequencies
 * - Transaction deletion with confirmation
 * - Real-time validation with user feedback
 * - Responsive layout for different screen sizes
 * - Customized UI for creation vs. editing workflows
 */
import { useState, useEffect, forwardRef } from 'react';
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Typography,
    IconButton,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide,
    CircularProgress,
    Autocomplete,
    Switch,
    FormControlLabel
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';

// Contexts
import { useUser } from '../../../../../contexts/UserContext';

// Utils
import { formatDate, prepareForBackend, supabaseToLocalString } from '../../../../../utils/dateUtils';
import { dispatchTransactionUpdated } from '../../../../../utils/events';

// Services
import { transactionService } from '../../../../../services/transaction.service';
import { categoryService } from '../../../../../services/category.service';

// Types
import type { Category } from '../../../../../types/supabase/category';
import type { Transaction, RecurrenceType } from '../../../../../types/supabase/transaction';

// Interface for transaction data to be updated
interface TransactionUpdateData {
    transaction_date: string;
    description: string | null;
    amount: number;
    category_id: string;
    recurrence_type: RecurrenceType;
    recurrence_end_date: string | null;
    recurrence_id?: string | null;
}

// Interface for updates to recurrent transactions
interface UpdateData {
    description: string | null;
    amount: number;
    category_id: string;
    transaction_date?: string;
    updateAll?: boolean;
}

// Interface for the TransactionForm component props
interface TransactionFormProps {
    transaction?: Transaction; // Optional existing transaction for editing mode
    onSubmit: () => void;     // Callback when form is successfully submitted
    onClose: () => void;      // Callback to close the form
    categories?: Category[];   // Optional categories array (can be passed from parent for performance)
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

/**
 * Calculates dates for recurring transactions based on parameters
 * 
 * @param startDate - Beginning date of the recurrence
 * @param endDate - End date of the recurrence 
 * @param recurrenceType - Frequency type (weekly, monthly, yearly)
 * @returns Array of calculated dates for the recurring transactions
 */
const calculateRecurringDates = (startDate: string, endDate: string, recurrenceType: RecurrenceType): Date[] => {
    // Create Date objects directly from the local dates from the form
    const start = new Date(startDate);
    const end = new Date(endDate);

    const dates: Date[] = [];
    // Create a copy to avoid modifying the original date
    const currentDate = new Date(start.getTime());

    while (currentDate <= end) {
        // Add a copy of the current date
        dates.push(new Date(currentDate.getTime()));

        // Increment the date based on the recurrence type
        switch (recurrenceType) {
            case 'weekly':
                currentDate.setDate(currentDate.getDate() + 7);
                break;
            case 'monthly':
                currentDate.setMonth(currentDate.getMonth() + 1);
                break;
            case 'yearly':
                currentDate.setFullYear(currentDate.getFullYear() + 1);
                break;
        }
    }

    return dates;
};

// TransactionForm component
export default function TransactionForm({ transaction, onSubmit, onClose, categories: propCategories }: TransactionFormProps) {
    const { t } = useTranslation();
    const { user } = useUser();
    const [categories, setCategories] = useState<Category[]>(propCategories || []);
    const [isLoadingCategories, setIsLoadingCategories] = useState(!propCategories);

    // Initialize form state, handling both new and edit modes
    const [date, setDate] = useState(() => {
        if (transaction) {
            // Convert UTC date to local format for the datetime-local input
            return supabaseToLocalString(transaction.transaction_date);
        }
        // For a new transaction, use the current local date and time
        const now = new Date();
        // Format the local date for the datetime-local input
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        // Format as YYYY-MM-DDTHH:mm:ss
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    });
    const [description, setDescription] = useState(transaction?.description || '');
    const [amount, setAmount] = useState(transaction ? Math.abs(transaction.amount).toString() : '');
    const [category, setCategory] = useState<Category | null>(null);
    const [isIncome, setIsIncome] = useState(transaction ? transaction.amount >= 0 : false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>(() => {
        return transaction?.recurrence_type || null;
    });
    const [recurrenceEndDate, setRecurrenceEndDate] = useState(() => {
        if (transaction?.recurrence_end_date) {
            return supabaseToLocalString(transaction.recurrence_end_date).substring(0, 10);
        }
        return '';
    });
    const [editRecurrentDialog, setEditRecurrentDialog] = useState(false);
    const [transactionDataToUpdate, setTransactionDataToUpdate] = useState<TransactionUpdateData | null>(null);
    const [updateAllRecurrent, setUpdateAllRecurrent] = useState(false);

    // Fetch categories if not provided via props
    useEffect(() => {
        const fetchCategories = async () => {
            if (propCategories) {
                setCategories(propCategories);
                setIsLoadingCategories(false);
                return;
            }
            
            try {
                setIsLoadingCategories(true);
                const response = await categoryService.getAllCategories();
                if (response.success) {
                    setCategories(response.data as Category[]);
                }
            } catch (error) {
                console.error('❌ Error fetching categories:', error);
                toast.error(t('dashboard.transactions.errors.categoryLoadError'));
            } finally {
                setIsLoadingCategories(false);
            }
        };

        fetchCategories();
    }, [propCategories, t]);

    // Set category after categories are loaded
    useEffect(() => {
        if (categories.length > 0 && transaction) {
            const foundCategory = categories.find(cat => cat.id === transaction.category_id);
            setCategory(foundCategory || null);
        }
    }, [categories, transaction]);

    // Update form data when transaction prop changes
    useEffect(() => {
        if (transaction) {
            // Convert UTC date to local format for the datetime-local input
            setDate(supabaseToLocalString(transaction.transaction_date));

            setDescription(transaction.description || '');
            setAmount(Math.abs(transaction.amount).toString());

            setIsIncome(transaction.amount >= 0);
            setRecurrenceType(transaction.recurrence_type);

            if (transaction.recurrence_end_date) {
                // Convert recurrence end date to local format
                setRecurrenceEndDate(supabaseToLocalString(transaction.recurrence_end_date).substring(0, 10));
            }
        }
    }, [transaction]);

    // Handle form submission with validation
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!amount || !category) {
            toast.error(t('dashboard.transactions.form.errors.requiredFields'));
            return;
        }

        // Validate recurrence fields if enabled
        if (recurrenceType !== null) {
            if (!recurrenceType) {
                toast.error(t('dashboard.transactions.form.errors.recurrenceTypeRequired'));
                return;
            }
            if (!recurrenceEndDate) {
                toast.error(t('dashboard.transactions.form.errors.recurrenceEndDateRequired'));
                return;
            }
        }

        try {
            setIsSubmitting(true);

            // Validate amount format
            const numAmount = parseFloat(amount);
            if (isNaN(numAmount)) {
                toast.error(t('dashboard.transactions.form.errors.invalidAmount'));
                setIsSubmitting(false);
                return;
            }

            // Prepare transaction data for submission
            const finalDescription = description.trim() || category.name || '';
            const localDate = new Date(date);
            // Convert local date to UTC for storage
            const utcDate = prepareForBackend(localDate);

            const transactionData: TransactionUpdateData = {
                transaction_date: utcDate,
                description: finalDescription,
                amount: numAmount * (isIncome ? 1 : -1),
                category_id: category.id,
                recurrence_type: recurrenceType || null,
                recurrence_end_date: recurrenceEndDate ? prepareForBackend(new Date(`${recurrenceEndDate}T23:59:59`)) : null,
                recurrence_id: transaction?.recurrence_id
            };

            // Special handling for recurrent transaction edits
            if (transaction?.recurrence_id !== null && transaction?.recurrence_id) {
                setTransactionDataToUpdate(transactionData);
                setEditRecurrentDialog(true);
                setIsSubmitting(false);
                return;
            }

            // Handle transaction update or creation
            if (transaction) {
                await transactionService.updateTransaction(transaction.id, transactionData);
                toast.success(t('dashboard.transactions.success.updated'));
                dispatchTransactionUpdated();
            } else {
                await transactionService.createTransaction(transactionData);
                toast.success(t('dashboard.transactions.success.created'));
                dispatchTransactionUpdated();
            }

            // Call callbacks for success
            onSubmit();
            onClose();
        } catch (error) {
            console.error('❌ Error in handleSubmit:', error);
            toast.error(t('dashboard.transactions.errors.updateError'));
            setIsSubmitting(false);
        }
    };

    // Open the delete confirmation dialog
    const handleDeleteClick = () => {
        setDeleteDialog(true);
    };

    // Delete transaction with recurrence awareness
    const confirmDelete = async () => {
        try {
            if (!transaction) return;
            
            await transactionService.deleteTransaction(
                transaction.id,
                transaction.recurrence_id ? updateAllRecurrent : undefined
            );
            toast.success(t('dashboard.transactions.success.deleted'));
            dispatchTransactionUpdated();
            onSubmit();
            onClose();
        } catch (error) {
            console.error('❌ Error in confirmDelete:', error);
            toast.error(t('dashboard.transactions.errors.deleteError'));
        } finally {
            setIsDeleting(false);
            setDeleteDialog(false);
        }
    };

    // Handle editing of recurrent transactions
    const handleEditRecurrent = async () => {
        if (!transaction || !transactionDataToUpdate) return;

        try {
            setIsSubmitting(true);

            // Prepare update data with or without date change
            const dataToUpdate: UpdateData = {
                description: transactionDataToUpdate.description,
                amount: transactionDataToUpdate.amount,
                category_id: transactionDataToUpdate.category_id
            };

            // Only include date if not updating all recurrences
            if (!updateAllRecurrent) {
                dataToUpdate.transaction_date = transactionDataToUpdate.transaction_date;
            }

            // Update transaction with appropriate flags
            await transactionService.updateTransaction(
                transaction.id,
                { ...dataToUpdate, updateAll: updateAllRecurrent }
            );

            toast.success(t('dashboard.transactions.success.updated'));
            dispatchTransactionUpdated();
            onSubmit();
            onClose();
        } catch (error) {
            console.error('❌ Error in handleEditRecurrent:', error);
            toast.error(t('dashboard.transactions.errors.updateError'));
            setIsSubmitting(false);
        } finally {
            setEditRecurrentDialog(false);
        }
    };

    // Sort categories alphabetically for better usability
    const sortedCategories = [...categories].sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    // Calculate recurring dates for preview
    const recurringDates = date && recurrenceType && recurrenceEndDate
        ? calculateRecurringDates(date, recurrenceEndDate, recurrenceType)
        : [];

    // Delete confirmation dialog component
    const DeleteDialog = () => (
        <Dialog
            open={deleteDialog}
            onClose={() => setDeleteDialog(false)}
            TransitionComponent={Transition}
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
            {/* Title of the delete confirmation dialog */}
            <DialogTitle sx={{
                textAlign: 'center',
                pt: 3,
                pb: 1
            }}>
                {t('dashboard.transactions.form.delete.title')}
            </DialogTitle>
            {/* Content of the delete confirmation dialog */}
            <DialogContent sx={{
                textAlign: 'center',
                py: 2
            }}>
                <Typography>
                    {t('dashboard.transactions.form.delete.message')}{' '}
                    <Typography component="span" fontWeight="bold" color="primary">
                        {description || category?.name || t('dashboard.transactions.form.delete.thisTransaction')}
                    </Typography>
                    ?
                </Typography>
                {/* Recurrent transaction additional options */}
                {transaction?.recurrence_id !== null && (
                    <>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                            {t('dashboard.transactions.form.delete.recurrentWarning')}
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={updateAllRecurrent}
                                    onChange={(e) => setUpdateAllRecurrent(e.target.checked)}
                                />
                            }
                            label={t('dashboard.transactions.form.delete.deleteAll')}
                        />
                    </>
                )}
            </DialogContent>
            {/* Dialog action buttons */}
            <DialogActions sx={{
                justifyContent: 'center',
                gap: 2,
                p: 3
            }}>
                {/* Cancel button */}
                <Button
                    variant="outlined"
                    onClick={() => setDeleteDialog(false)}
                    sx={{ width: '120px' }}
                >
                    {t('dashboard.common.cancel')}
                </Button>
                {/* Delete button with loading state */}
                <Button
                    variant="contained"
                    color="error"
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    sx={{ width: '120px' }}
                >
                    {isDeleting ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        t('dashboard.common.delete')
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );

    // Recurrence configuration fields component
    const RecurrenceFields = ({ isEditing }: { isEditing: boolean }) => {
        // Determine if fields should be disabled
        // For existing recurring transactions, always disable
        const fieldsDisabled = isEditing && transaction?.recurrence_id !== null;

        return (
            <Box sx={{ width: '100%', mt: 2 }}>
                {/* Recurrence type selection */}
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    {/* Label for the recurrence type */}
                    <InputLabel>{t('dashboard.transactions.form.fields.recurrenceType')}</InputLabel>
                    <Select
                        value={recurrenceType || ''}
                        onChange={(e) => setRecurrenceType(e.target.value as RecurrenceType)}
                        label={t('dashboard.transactions.form.fields.recurrenceType')}
                        disabled={fieldsDisabled}
                        error={!recurrenceType}
                        required
                    >
                        <MenuItem value="weekly">{t('dashboard.transactions.form.fields.weekly')}</MenuItem>
                        <MenuItem value="monthly">{t('dashboard.transactions.form.fields.monthly')}</MenuItem>
                        <MenuItem value="yearly">{t('dashboard.transactions.form.fields.yearly')}</MenuItem>
                    </Select>
                </FormControl>

                {/* End date selection for recurrence */}
                <TextField
                    type="date"
                    label={t('dashboard.transactions.form.fields.recurrenceEndDate')}
                    value={recurrenceEndDate}
                    onChange={(e) => setRecurrenceEndDate(e.target.value)}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    disabled={fieldsDisabled}
                    error={!recurrenceEndDate && recurrenceType !== null}
                    required
                />

                {/* Preview of calculated recurring dates */}
                {date && recurrenceType && recurrenceEndDate && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {t('dashboard.transactions.form.fields.recurrenceDates')}:
                        </Typography>
                        {recurringDates.length > 0 ? (
                            recurringDates.slice(0, 5).map((date, index) => (
                                <Typography
                                    key={index}
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 0.5 }}
                                >
                                    {formatDate(date, user)}
                                </Typography>
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                {t('dashboard.transactions.form.fields.noRecurrenceDates')}
                            </Typography>
                        )}
                        {recurringDates.length > 5 && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {t('dashboard.transactions.form.fields.andMoreDates', { count: recurringDates.length - 5 })}
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>
        );
    };

    // Recurrence toggle switch component
    const RecurrenceSwitch = ({ isEditing }: { isEditing: boolean }) => {
        // If editing a non-recurring transaction, don't show recurrence options at all
        if (isEditing && transaction?.recurrence_id === null) {
            return null;
        }

        return (
            // Container for recurrence toggle and fields
            <Paper
                elevation={2}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    pt: 1,
                    px: 2,
                    pb: recurrenceType ? 2 : 1,
                    borderRadius: 3,
                }}>
                {/* Toggle switch row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, width: '100%' }}>
                    {/* Label for recurrence toggle */}
                    <Typography>{t('dashboard.transactions.form.fields.isRecurrent')}</Typography>
                    {/* Recurrence toggle switch */}
                    <Switch
                        checked={recurrenceType !== null}
                        disabled={isEditing && transaction?.recurrence_id !== null}
                        onChange={(e) => {
                            // Update the recurrence state based on switch value
                            if (e.target.checked) {
                                // Enable recurrence without setting specific type
                                // User will need to select type themselves
                                setRecurrenceType(null); // Temporarily set to null to avoid validation errors
                                // Use setTimeout to allow the component to render before selecting the type
                                setTimeout(() => setRecurrenceType('monthly'), 0);
                            } else {
                                setRecurrenceType(null);
                                setRecurrenceEndDate('');
                            }
                        }}
                    />
                </Box>

                {/* Show recurrence fields when recurrence is enabled */}
                {recurrenceType !== null && <RecurrenceFields isEditing={isEditing} />}
            </Paper>
        );
    };

    // Dialog for editing recurrent transactions
    const EditRecurrentDialog = () => (
        <Dialog
            open={editRecurrentDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setEditRecurrentDialog(false)}
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
            <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
                {t('dashboard.transactions.form.editRecurrent.title')}
            </DialogTitle>
            <DialogContent sx={{
                py: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
            }}>
                <Typography>
                    {t('dashboard.transactions.form.editRecurrent.message')}
                </Typography>
                <FormControlLabel
                    control={
                        <Switch
                            checked={updateAllRecurrent}
                            onChange={(e) => setUpdateAllRecurrent(e.target.checked)}
                        />
                    }
                    label={t('dashboard.transactions.form.editRecurrent.updateAll')}
                    sx={{ mt: 2 }}
                />
            </DialogContent>
            <DialogActions sx={{
                justifyContent: 'center',
                gap: 2,
                p: 3
            }}>
                <Button
                    variant="outlined"
                    onClick={() => setEditRecurrentDialog(false)}
                    sx={{ width: '120px' }}
                >
                    {t('dashboard.common.cancel')}
                </Button>
                <Button
                    variant="contained"
                    onClick={handleEditRecurrent}
                    color="primary"
                    sx={{ width: '120px' }}
                >
                    {t('dashboard.common.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );

    // Show a loading state if categories are being loaded
    if (isLoadingCategories) {
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                p: 3 
            }}>
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography>{t('dashboard.common.loading')}</Typography>
            </Box>
        );
    }

    // Main form component structure
    return (
        <Box sx={{ p: 3 }}>
            {/* Header with close button and title */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={onClose} sx={{ mr: 2 }}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6">
                    {transaction 
                        ? t('dashboard.transactions.form.title.edit') 
                        : t('dashboard.transactions.form.title.new')}
                </Typography>
            </Box>

            {/* Transaction form */}
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                    {/* Date and time input field */}
                    <Paper
                        elevation={2}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: '100%',
                            p: 1,
                            borderRadius: 3,
                        }}>
                        <TextField
                            size="small"
                            label={t('dashboard.transactions.form.fields.date')}
                            type="datetime-local"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            fullWidth
                            required
                        />
                    </Paper>

                    {/* Transaction type selection (income/expense) */}
                    <Paper
                        elevation={2}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: '100%',
                            p: 1,
                            borderRadius: 3,
                        }}>
                        <FormControl
                            fullWidth
                            size="small"
                            required
                        >
                            <InputLabel>{t('dashboard.transactions.form.fields.type')}</InputLabel>
                            <Select
                                value={isIncome}
                                label={t('dashboard.transactions.form.fields.type')}
                                onChange={(e) => setIsIncome(e.target.value === 'true')}
                            >
                                <MenuItem value="false">{t('dashboard.transactions.form.fields.expense')}</MenuItem>
                                <MenuItem value="true">{t('dashboard.transactions.form.fields.income')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Paper>

                    {/* Category selection with autocomplete */}
                    <Paper
                        elevation={2}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: '100%',
                            p: 1,
                            borderRadius: 3,
                        }}>
                        <Autocomplete
                            fullWidth
                            value={category}
                            onChange={(_, newValue) => setCategory(newValue)}
                            options={sortedCategories}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    label={t('dashboard.transactions.form.fields.category')}
                                    required
                                />
                            )}
                            renderOption={(props, option) => {
                                const { key, ...restProps } = props;
                                return (
                                    <li key={key} {...restProps}>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            width: '100%'
                                        }}>
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    bgcolor: option.color
                                                }}
                                            />
                                            {option.name}
                                        </Box>
                                    </li>
                                );
                            }}
                        />
                    </Paper>

                    {/* Description input field */}
                    <Paper
                        elevation={2}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: '100%',
                            p: 1,
                            borderRadius: 3,
                        }}>
                        <TextField
                            size="small"
                            label={t('dashboard.transactions.form.fields.description')}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                        />
                    </Paper>

                    {/* Amount input field with formatting */}
                    <Paper
                        elevation={2}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: '100%',
                            p: 1,
                            borderRadius: 3,
                        }}>
                        <TextField
                            size="small"
                            label={t('dashboard.transactions.form.fields.amount')}
                            type="text"
                            slotProps={{
                                htmlInput: {
                                    inputMode: 'decimal',
                                    pattern: '^[0-9]*([.,][0-9]{0,2})?$'
                                }
                            }}
                            value={amount}
                            onChange={(e) => {
                                // Replace commas with dots and validate the format
                                const value = e.target.value.replace(',', '.');
                                if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                                    setAmount(value);
                                }
                            }}
                            fullWidth
                            required
                        />
                    </Paper>

                    {/* Recurrence configuration section */}
                    <RecurrenceSwitch isEditing={!!transaction} />

                    {/* Action buttons for form submission */}
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                        {transaction ? (
                            // Edit mode buttons (delete and update)
                            <>
                                <Button
                                    onClick={handleDeleteClick}
                                    variant="outlined"
                                    color="error"
                                    disabled={isDeleting || isSubmitting}
                                    fullWidth
                                >
                                    {t('dashboard.common.delete')}
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                    fullWidth
                                >
                                    {isSubmitting ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        t('dashboard.common.update')
                                    )}
                                </Button>
                            </>
                        ) : (
                            // Create mode buttons (cancel and create)
                            <>
                                <Button
                                    onClick={onClose}
                                    variant="outlined"
                                    disabled={isSubmitting}
                                    fullWidth
                                >
                                    {t('dashboard.common.cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                    fullWidth
                                >
                                    {isSubmitting ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        t('dashboard.common.create')
                                    )}
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>
            </form>

            {/* Dialogs for delete confirmation and recurrence editing */}
            <DeleteDialog />
            <EditRecurrentDialog />
        </Box>
    );
} 