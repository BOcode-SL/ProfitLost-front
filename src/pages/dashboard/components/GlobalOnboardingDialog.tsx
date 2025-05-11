/**
 * Global Onboarding Dialog Module
 * 
 * Provides a multi-step onboarding experience for new users.
 * 
 * Responsibilities:
 * - Guides users through initial application setup
 * - Collects user preferences (language, currency, date format)
 * - Facilitates selection of financial tracking categories
 * - Persists progress across browser sessions
 * - Communicates with backend services to save preferences
 * 
 * @module GlobalOnboardingDialog
 */

import { useState, forwardRef, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slide,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// Contexts
import { useUser } from '../../../contexts/UserContext';

// Services
import { userService } from '../../../services/user.service';
import { categoryService } from '../../../services/category.service';

// Types
import { Language, Currency, DateFormat, TimeFormat, PreferenceContent } from '../../../types/supabase/preferences';

/**
 * Interface for tracking onboarding progress in localStorage
 * 
 * @interface OnboardingProgress
 */
interface OnboardingProgress {
    /** Current active step in the wizard */
    activeStep: number;
    
    /** User selected preferences */
    preferences: {
        /** User interface language */
        language?: Language;
        
        /** Currency for financial calculations */
        currency?: Currency;
        
        /** Date display format */
        dateFormat?: DateFormat;
        
        /** Time display format */
        timeFormat?: TimeFormat;
    };
    
    /** Array of category IDs selected by the user */
    selectedCategories: string[];
}

/**
 * Configuration options for preference selections
 * Each option has a label for display and a value for API
 */
// Format options
const dateFormatOptions = [
    { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' as DateFormat },
    { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' as DateFormat }
];
const timeFormatOptions = [
    { label: '12h (AM/PM)', value: '12h' as TimeFormat },
    { label: '24h', value: '24h' as TimeFormat }
];
const currencyOptions = [
    { label: 'USD - US Dollar', value: 'USD' as Currency },
    { label: 'EUR - Euro', value: 'EUR' as Currency },
    { label: 'GBP - British Pound', value: 'GBP' as Currency },
    { label: 'MXN - Peso Mexicano', value: 'MXN' as Currency },
    { label: 'ARS - Peso Argentino', value: 'ARS' as Currency },
    { label: 'CLP - Peso Chileno', value: 'CLP' as Currency },
    { label: 'COP - Peso Colombiano', value: 'COP' as Currency },
    { label: 'PEN - Sol Peruano', value: 'PEN' as Currency },
    { label: 'UYU - Peso Uruguayo', value: 'UYU' as Currency },
    { label: 'PYG - Guaraní Paraguayo', value: 'PYG' as Currency },
    { label: 'BOB - Boliviano', value: 'BOB' as Currency },
    { label: 'VES - Bolívar Venezolano', value: 'VES' as Currency }
];
const languageOptions = [
    { value: 'enUS' as Language, label: 'English (US)' },
    { value: 'esES' as Language, label: 'Español (ES)' }
];

/**
 * Predefined category templates by language
 * These serve as default categories users can select during onboarding
 */
const defaultCategories = {
    enUS: [
        { id: 0, name: 'Supermarket', color: '#FF6F61' },
        { id: 1, name: 'Transportation', color: '#6A5ACD' },
        { id: 2, name: 'Entertainment', color: '#FF8C00' },
        { id: 3, name: 'Shopping', color: '#32CD32' },
        { id: 4, name: 'House', color: '#20B2AA' },
        { id: 5, name: 'Healthcare', color: '#FF4500' },
        { id: 6, name: 'Salary', color: '#3CB371' },
        { id: 7, name: 'Investments', color: '#1E90FF' }
    ],
    esES: [
        { id: 0, name: 'Supermercado', color: '#FF6F61' },
        { id: 1, name: 'Transporte', color: '#6A5ACD' },
        { id: 2, name: 'Entretenimiento', color: '#FF8C00' },
        { id: 3, name: 'Compras', color: '#32CD32' },
        { id: 4, name: 'Casa', color: '#20B2AA' },
        { id: 5, name: 'Salud', color: '#FF4500' },
        { id: 6, name: 'Salario', color: '#3CB371' },
        { id: 7, name: 'Inversiones', color: '#1E90FF' }
    ]
} as const;

/**
 * Saves onboarding progress to local storage
 * 
 * @param {OnboardingProgress} progress - The current onboarding progress to save
 */
const saveProgress = (progress: OnboardingProgress) => {
    localStorage.setItem('onboarding_progress', JSON.stringify(progress));
};

/**
 * Loads onboarding progress from local storage
 * 
 * @returns {OnboardingProgress|null} The saved progress or null if none exists
 */
const loadProgress = (): OnboardingProgress | null => {
    const saved = localStorage.getItem('onboarding_progress');
    return saved ? JSON.parse(saved) : null;
};

/**
 * Clears onboarding progress from local storage
 */
const clearProgress = () => {
    localStorage.removeItem('onboarding_progress');
};

/**
 * Dialog transition component for smooth animation
 * Uses a slide-up effect for better user experience
 * 
 * @param {TransitionProps & {children: React.ReactElement}} props - Transition properties
 * @param {React.Ref<unknown>} ref - Forwarded ref
 * @returns {JSX.Element} The transition component
 */
const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * Interface for GlobalOnboardingDialog component props
 * 
 * @interface GlobalOnboardingDialogProps
 */
interface GlobalOnboardingDialogProps {
    /** Indicates if the dialog is currently open */
    open: boolean;
    
    /** Callback function to execute when the dialog is closed */
    onClose: () => void;
}

/**
 * Global Onboarding Dialog Component
 * 
 * Multi-step wizard that guides new users through initial setup:
 * 1. User preferences (language, currency, date format)
 * 2. Category selection for financial tracking
 * 
 * Features:
 * - Progress persistence between sessions
 * - Responsive design
 * - Language-specific content
 * - API integration for saving preferences
 * 
 * @param {GlobalOnboardingDialogProps} props - The component props
 * @param {boolean} props.open - Whether the dialog is currently open
 * @param {() => void} props.onClose - Function to call when the dialog closes
 * @returns {JSX.Element} The rendered GlobalOnboardingDialog component
 */
export default function GlobalOnboardingDialog({ open, onClose }: GlobalOnboardingDialogProps) {
    const { t, i18n } = useTranslation();
    const { userPreferences, loadUserData } = useUser();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [activeStep, setActiveStep] = useState(0);
    const [preferences, setPreferences] = useState<OnboardingProgress["preferences"]>({
        language: userPreferences?.language || 'enUS',
        currency: userPreferences?.currency || 'USD',
        dateFormat: userPreferences?.dateFormat || 'MM/DD/YYYY',
        timeFormat: userPreferences?.timeFormat || '12h'
    });
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // Steps in the onboarding process
    const steps = [
        t('dashboard.onboarding.steps.preferences'),
        t('dashboard.onboarding.steps.categories')
    ];

    /**
     * Loads saved progress when the dialog opens
     */
    useEffect(() => {
        if (open) {
            const savedProgress = loadProgress();
            if (savedProgress) {
                setActiveStep(savedProgress.activeStep);
                setPreferences({
                    language: savedProgress.preferences.language ?? 'enUS',
                    currency: savedProgress.preferences.currency ?? 'USD',
                    dateFormat: savedProgress.preferences.dateFormat ?? 'MM/DD/YYYY',
                    timeFormat: savedProgress.preferences.timeFormat ?? '12h'
                });
                setSelectedCategories(savedProgress.selectedCategories);
            }
        }
    }, [open]);

    /**
     * Saves progress when states change
     */
    useEffect(() => {
        if (open) {
            saveProgress({
                activeStep,
                preferences,
                selectedCategories
            });
        }
    }, [activeStep, preferences, selectedCategories, open]);

    /**
     * Handles preference changes with language switching
     * 
     * @param {string} key - The preference key to update
     * @param {string} value - The new value for the preference
     */
    const handlePreferenceChange = (key: string, value: string) => {
        setPreferences(prev => {
            const newPreferences = {
                ...prev,
                [key]: value
            };
            
            // Update i18n language if the language preference changes
            if (key === 'language') {
                const newLang = value === 'esES' ? 'es' : 'en';
                i18n.changeLanguage(newLang);
            }
            
            return newPreferences;
        });
    };

    /**
     * Handles the next button with API interactions
     * Saves user preferences and categories, advancing through wizard steps
     */
    const handleNext = async () => {
        try {
            if (activeStep === 0) {
                // Step 1: Save user preferences to API
                // Create a complete PreferenceContent object to match Supabase structure
                const completePreferences: PreferenceContent = {
                    language: preferences.language || 'enUS',
                    currency: preferences.currency || 'USD',
                    dateFormat: preferences.dateFormat || 'MM/DD/YYYY',
                    timeFormat: preferences.timeFormat || '12h',
                    theme: 'light', // Default theme
                    viewMode: 'yearToday', // Default view mode
                    onboarding: {
                        completed: false,
                        sections: []
                    }
                };
                
                await userService.onboardingPreferences(completePreferences);
                await loadUserData();
                setActiveStep((prevStep) => prevStep + 1);
            } else if (activeStep === steps.length - 1) {
                // Step 2: Validate and save categories
                // Validate that at least one category is selected
                if (selectedCategories.length === 0) {
                    toast.error(t('dashboard.onboarding.errors.selectCategory'));
                    return;
                }

                // Map selected categories and create them via API
                const selectedCats = selectedCategories.map(index => {
                    const category = defaultCategories[preferences.language as keyof typeof defaultCategories][parseInt(index)];
                    return {
                        name: category.name,
                        color: category.color
                    };
                });
                await categoryService.createDefaultCategories(selectedCats);
                await userService.completeOnboarding();
                await loadUserData();
                clearProgress();
                onClose();
                setActiveStep((prevStep) => prevStep + 1);
            }
        } catch (error) {
            console.error('Error in the onboarding process:', error);
            toast.error(t('dashboard.onboarding.errors.title'));
        }
    };

    /**
     * Handles the back button
     * Returns to the previous step in the wizard
     */
    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    /**
     * Renders content for the current step in the wizard
     * 
     * @param {number} step - The current step index
     * @returns {JSX.Element|null} The step content or null
     */
    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ py: 2 }}>
                        <Typography gutterBottom>
                            {t('dashboard.onboarding.preferences.title')}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>{t('dashboard.onboarding.preferences.language')}</InputLabel>
                                <Select
                                    value={preferences.language}
                                    label={t('dashboard.onboarding.preferences.language')}
                                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                                >
                                    {languageOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth size="small">
                                <InputLabel>{t('dashboard.onboarding.preferences.currency')}</InputLabel>
                                <Select
                                    value={preferences.currency}
                                    label={t('dashboard.onboarding.preferences.currency')}
                                    onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                                >
                                    {currencyOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth size="small">
                                <InputLabel>{t('dashboard.onboarding.preferences.dateFormat')}</InputLabel>
                                <Select
                                    value={preferences.dateFormat}
                                    label={t('dashboard.onboarding.preferences.dateFormat')}
                                    onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                                >
                                    {dateFormatOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth size="small">
                                <InputLabel>{t('dashboard.onboarding.preferences.timeFormat')}</InputLabel>
                                <Select
                                    value={preferences.timeFormat}
                                    label={t('dashboard.onboarding.preferences.timeFormat')}
                                    onChange={(e) => handlePreferenceChange('timeFormat', e.target.value)}
                                >
                                    {timeFormatOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ py: 2 }}>
                        <Typography gutterBottom>
                            {t('dashboard.onboarding.categories.title')}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                            {defaultCategories[preferences.language as keyof typeof defaultCategories].map((category, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        p: 1,
                                        border: 1,
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                        cursor: 'pointer',
                                        bgcolor: selectedCategories.includes(index.toString())
                                            ? 'action.selected'
                                            : 'transparent',
                                        '&:hover': {
                                            bgcolor: 'action.hover'
                                        }
                                    }}
                                    onClick={() => {
                                        setSelectedCategories(prev =>
                                            prev.includes(index.toString())
                                                ? prev.filter(id => id !== index.toString())
                                                : [...prev, index.toString()]
                                        );
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            bgcolor: category.color,
                                            mr: 2
                                        }}
                                    />
                                    <Typography sx={{ flex: 1 }}>
                                        {category.name}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            maxWidth="sm"
            fullWidth
            fullScreen={fullScreen}
            sx={{
                '& .MuiDialog-container': {
                    alignItems: { xs: 'flex-end', sm: 'center' }
                },
                '& .MuiPaper-root': {
                    borderRadius: { xs: 0, sm: 3 },
                    height: { xs: 'calc(100dvh - 56px)', sm: 'auto' },
                    width: { xs: '100%', sm: '100%' },
                    maxHeight: { xs: 'calc(100dvh - 56px)', sm: '80dvh' },
                    m: { xs: 0, sm: 3 },
                    borderTopLeftRadius: { xs: 16, sm: 3 },
                    borderTopRightRadius: { xs: 16, sm: 3 },
                    borderBottomLeftRadius: { xs: 0, sm: 3 },
                    borderBottomRightRadius: { xs: 0, sm: 3 }
                },
                '& .MuiBackdrop-root': {
                    backgroundColor: { xs: 'rgba(0, 0, 0, 0.7)', sm: 'rgba(0, 0, 0, 0.5)' }
                }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </DialogTitle>

            <DialogContent>
                {getStepContent(activeStep)}
            </DialogContent>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3 }}>
                <Button
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    variant="outlined"
                    sx={{ width: '120px' }}
                >
                    {t('dashboard.onboarding.buttons.back')}
                </Button>
                <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ width: '120px' }}
                >
                    {activeStep === steps.length - 1
                        ? t('dashboard.onboarding.buttons.finish')
                        : t('dashboard.onboarding.buttons.next')}
                </Button>
            </Box>
        </Dialog>
    );
}
