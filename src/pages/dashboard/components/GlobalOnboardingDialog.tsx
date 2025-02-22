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
    Slide
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
import { Language, Currency, DateFormat, TimeFormat, OnboardingProgress, UserPreferences } from '../../../types/models/user';

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
    { label: 'GBP - British Pound', value: 'GBP' as Currency }
];
const languageOptions = [
    { value: 'enUS' as Language, label: 'English (US)' },
    { value: 'esES' as Language, label: 'Español (ES)' }
];

// Default categories for onboarding
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

// Function to save onboarding progress to local storage
const saveProgress = (progress: OnboardingProgress) => {
    localStorage.setItem('onboarding_progress', JSON.stringify(progress));
};

// Function to load onboarding progress from local storage
const loadProgress = (): OnboardingProgress | null => {
    const saved = localStorage.getItem('onboarding_progress');
    return saved ? JSON.parse(saved) : null;
};

// Function to clear onboarding progress from local storage
const clearProgress = () => {
    localStorage.removeItem('onboarding_progress');
};

// Transition component for the dialog
const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface GlobalOnboardingDialogProps {
    open: boolean; // Indicates if the dialog is open
    onClose: () => void; // Function to call when the dialog is closed
}

// Global onboarding dialog component
export default function GlobalOnboardingDialog({ open, onClose }: GlobalOnboardingDialogProps) {
    const { t, i18n } = useTranslation();
    const { user, loadUserData } = useUser();

    const [activeStep, setActiveStep] = useState(0);
    const [preferences, setPreferences] = useState<UserPreferences>({
        language: user?.preferences?.language || 'enUS',
        currency: user?.preferences?.currency || 'USD',
        dateFormat: user?.preferences?.dateFormat || 'MM/DD/YYYY',
        timeFormat: user?.preferences?.timeFormat || '12h'
    });
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // Steps in the onboarding process
    const steps = [
        t('dashboard.onboarding.steps.preferences'),
        t('dashboard.onboarding.steps.categories')
    ];

    // Load saved progress when the dialog opens
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

    // Save progress when states change
    useEffect(() => {
        if (open) {
            saveProgress({
                activeStep,
                preferences,
                selectedCategories
            });
        }
    }, [activeStep, preferences, selectedCategories, open]);

    // Handler for preference changes
    const handlePreferenceChange = (key: string, value: string) => {
        setPreferences(prev => {
            const newPreferences = {
                ...prev,
                [key]: value
            };
            
            // If the change is for language, update i18n
            if (key === 'language') {
                const newLang = value === 'esES' ? 'es' : 'en';
                i18n.changeLanguage(newLang);
            }
            
            return newPreferences;
        });
    };

    // Handler for the next button
    const handleNext = async () => {
        try {
            if (activeStep === 0) {
                await userService.onboardingPreferences(preferences);
                await loadUserData();
            } else if (activeStep === steps.length - 1) {
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
            }
            setActiveStep((prevStep) => prevStep + 1);
        } catch (error) {
            console.error('Error in the onboarding process:', error);
            toast.error(t('dashboard.onboarding.errors.title'));
        }
    };

    // Handler for the back button
    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    // Get content for the current step
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
            PaperProps={{
                sx: {
                    borderRadius: 3
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
