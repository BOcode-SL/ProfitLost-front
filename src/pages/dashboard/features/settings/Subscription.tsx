/**
 * Subscription Management Module
 * 
 * Provides comprehensive subscription plan management with visual metrics
 * and upgrade options.
 * 
 * Key Features:
 * - Current subscription status visualization
 * - Trial period tracking with remaining days calculation
 * - Plan comparison with feature highlights
 * - Visual plan selection with clear pricing information
 * - Responsive layout adapting to different screen sizes
 * - Consistent styling with other dashboard components
 */

import {
    Box,
    Typography,
    Paper,
    Button,
    Card,
    CardContent,
    CardActions,
    Divider,
    Chip,
    Stack,
    CircularProgress,
    Alert
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';

// Contexts
import { useUser } from '../../../../contexts/UserContext';

// Utils
import { formatDate } from '../../../../utils/dateUtils';

// Services
import { subscriptionService } from '../../../../services/subscription.service';

// Types
import { PlanType, SubscriptionStatus } from '../../../../types/supabase/subscriptions';
import { UserWithPreferences } from '../../../../contexts/UserContext';
import { ApiResponse } from '../../../../types/api/common';

// Component interfaces
interface TrialPeriodInfoProps {
    trialStart: string;
    trialEnd: string;
    daysRemaining: number;
    user: UserWithPreferences | null;
}

interface SubscriptionPeriodInfoProps {
    periodStart: string;
    periodEnd: string;
    status: SubscriptionStatus;
    user: UserWithPreferences | null;
}

interface PlanCardProps {
    planType: PlanType;
    handleSubscribe: (planType: PlanType) => void;
    priceId?: string;
    isLoading: boolean;
}

interface ManageSubscriptionButtonProps {
    onClick: () => void;
    isLoading: boolean;
}

interface PlanTypeDisplayProps {
    planType: PlanType;
}

interface SubscriptionPlan {
    id: string;
    name: string;
    planType: PlanType;
    priceId: string;
    amount: number;
    currency: string;
    interval: string;
}

interface ApiPlan {
    id: string;
    name: string;
    unit_amount: number;
    currency: string;
    interval: string;
}

// Component for trial period information
const TrialPeriodInfo = ({ trialStart, trialEnd, daysRemaining, user }: TrialPeriodInfoProps) => {
    const { t } = useTranslation();

    return (
        <Box sx={{
            flex: '1 1 45%',
            minWidth: { xs: '100%', sm: '120px' },
            mb: { xs: 1, sm: 0 }
        }}>
            <Typography variant="subtitle2" gutterBottom>
                {t('dashboard.settings.subscription.trialPeriod')}
            </Typography>
            <Box sx={{
                display: 'flex',
                gap: 1,
                flexWrap: { xs: 'wrap', sm: 'nowrap' }
            }}>
                <Typography variant="body2" color="text.secondary">
                    {formatDate(trialStart, user)}
                </Typography>
                <Typography variant="body2" color="text.secondary">-</Typography>
                <Typography
                    variant="body2"
                    fontWeight={daysRemaining <= 3 ? "500" : "normal"}
                    color={daysRemaining <= 3 ? "error.main" : "text.secondary"}
                >
                    {formatDate(trialEnd, user)}
                </Typography>
            </Box>
        </Box>
    );
};

// Component for subscription period information
const SubscriptionPeriodInfo = ({ periodStart, periodEnd, status, user }: SubscriptionPeriodInfoProps) => {
    const { t } = useTranslation();

    return (
        <Box sx={{
            flex: '1 1 45%',
            minWidth: { xs: '100%', sm: '120px' },
            mb: { xs: 1, sm: 0 }
        }}>
            <Typography variant="subtitle2" gutterBottom>
                {status === 'active'
                    ? t('dashboard.settings.subscription.subscriptionPeriod')
                    : status === 'canceled'
                        ? t('dashboard.settings.subscription.statuses.canceled')
                        : t('dashboard.settings.subscription.subscriptionPeriod')
                }
            </Typography>
            <Box sx={{
                display: 'flex',
                gap: 1,
                flexWrap: { xs: 'wrap', sm: 'nowrap' }
            }}>
                <Typography variant="body2" color="text.secondary">
                    {formatDate(periodStart, user)}
                </Typography>
                <Typography variant="body2" color="text.secondary">-</Typography>
                <Typography
                    variant="body2"
                    color={status === 'canceled' ? "error.main" : "text.secondary"}
                >
                    {formatDate(periodEnd, user)}
                </Typography>
            </Box>
        </Box>
    );
};

// Component for a single subscription plan card
// const PlanCard = ({ planType, handleSubscribe, priceId, isLoading }: PlanCardProps) => {
const PlanCard = ({ planType, handleSubscribe, isLoading }: PlanCardProps) => {
    const { t } = useTranslation();
    const isMonthly = planType === 'monthly';
    const color = isMonthly ? "primary" : "secondary";

    return (
        <Card
            elevation={1}
            sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s ease',
                flex: { xs: '1 1 100%', md: '1 0 48%' },
                minHeight: { xs: 'auto', md: '350px' }
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="500">
                        {t(`dashboard.settings.subscription.plans.${planType}.title`)}
                    </Typography>
                    <Chip
                        label={t(isMonthly
                            ? 'dashboard.settings.subscription.mostPopular'
                            : 'dashboard.settings.subscription.bestValue')}
                        color={color}
                        size="small"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                </Box>

                <Typography variant="h6" fontWeight="700" mb={0.5}>
                    {t(`dashboard.settings.subscription.plans.${planType}.price`)}
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={1.5}>
                    {t(`dashboard.settings.subscription.plans.${planType}.description`)}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Stack spacing={1} my={1.5}>
                    {['feature1', 'feature2', 'feature3'].map(feature => (
                        <Box key={feature} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleOutlineIcon color={color} fontSize="small" sx={{ fontSize: '1rem' }} />
                            <Typography variant="body2">
                                {t(`dashboard.settings.subscription.features.${feature}`)}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleSubscribe(planType)}
                    // disabled={isLoading || !priceId}
                    disabled={true}
                    color={color}
                >
                    {isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        t('dashboard.settings.subscription.subscribe')
                    )}
                </Button>
            </CardActions>
        </Card>
    );
};

// Component for subscription management button
const ManageSubscriptionButton = ({ onClick, isLoading }: ManageSubscriptionButtonProps) => {
    const { t } = useTranslation();

    return (
        <Button
            variant="contained"
            color="primary"
            startIcon={!isLoading && <PaymentOutlinedIcon />}
            onClick={onClick}
            disabled={isLoading}
            sx={{ alignSelf: 'flex-start' }}
        >
            {isLoading ? (
                <CircularProgress size={24} color="inherit" />
            ) : (
                t('dashboard.settings.subscription.manage')
            )}
        </Button>
    );
};

// Component to display the current plan type
const PlanTypeDisplay = ({ planType }: PlanTypeDisplayProps) => {
    const { t } = useTranslation();

    const getPlanColor = () => {
        switch (planType) {
            case 'monthly': return 'primary';
            case 'annual': return 'secondary';
            case 'trial': return 'info';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ mb: 1 }}>
            <Chip
                label={t(`dashboard.settings.subscription.planTypes.${planType}`)}
                color={getPlanColor()}
                size="small"
                sx={{ fontWeight: 500 }}
            />
        </Box>
    );
};

// Main component
export default function Subscription() {
    const { t } = useTranslation();
    const { user, userSubscription } = useUser();
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingPlans, setIsLoadingPlans] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Get days remaining in trial
    const getDaysRemaining = () => {
        if (!userSubscription?.trial_end) return 0;

        const trialEnd = new Date(userSubscription.trial_end);
        const today = new Date();
        const diffTime = trialEnd.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return Math.max(0, diffDays);
    };

    // Fetch subscription plans
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setIsLoadingPlans(true);
                const response = await subscriptionService.getSubscriptionPlans();

                if (response.data && Array.isArray(response.data)) {
                    const formattedPlans = response.data.map((planData: Record<string, unknown>) => {
                        // Cast to ApiPlan with necessary type safety
                        const plan: ApiPlan = {
                            id: String(planData.id || ''),
                            name: String(planData.name || ''),
                            unit_amount: Number(planData.unit_amount || 0),
                            currency: String(planData.currency || 'usd'),
                            interval: String(planData.interval || 'month')
                        };

                        // Ensure we properly detect the plan type regardless of API naming convention
                        let planType: PlanType;
                        const interval = plan.interval.toLowerCase();

                        if (interval === 'month') {
                            planType = 'monthly';
                        } else if (interval === 'year') {
                            planType = 'annual';
                        } else if (interval.includes('month')) {
                            planType = 'monthly';
                        } else if (interval.includes('year') || interval.includes('annual')) {
                            planType = 'annual';
                        } else {
                            planType = 'monthly';
                        }

                        return {
                            id: plan.id,
                            name: plan.name,
                            planType: planType,
                            priceId: plan.id,
                            amount: plan.unit_amount / 100, // Convert cents to currency units
                            currency: plan.currency,
                            interval: plan.interval
                        };
                    });

                    setPlans(formattedPlans);
                }
                setError(null);
            } catch (err) {
                const apiError = err as ApiResponse;
                setError(apiError.message || 'Failed to load subscription plans');
                console.error('Error fetching subscription plans:', err);
            } finally {
                setIsLoadingPlans(false);
            }
        };

        fetchPlans();
    }, []);

    // Handle subscription purchase
    const handleSubscribe = async (planType: PlanType) => {
        const plan = plans.find(p => p.planType === planType);

        if (!plan) {
            setError(`No ${planType} plan found`);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // Create URLs for success and cancel
            const successUrl = `${window.location.origin}/dashboard/settings`;
            const cancelUrl = `${window.location.origin}/dashboard/settings`;

            const response = await subscriptionService.createCheckoutSession(
                plan.priceId,
                successUrl,
                cancelUrl
            );

            if (response.url) {
                // Redirect to Stripe Checkout
                window.location.href = response.url;
            } else {
                setError('No checkout URL returned');
            }
        } catch (err) {
            const apiError = err as ApiResponse;
            setError(apiError.message || 'Failed to create checkout session');
            console.error('Error creating checkout session:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle subscription management
    const handleManageSubscription = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Create return URL
            const returnUrl = `${window.location.origin}/dashboard/settings`;

            const response = await subscriptionService.createPortalSession(returnUrl);

            if (response.url) {
                // Redirect to Stripe Customer Portal
                window.location.href = response.url;
            } else {
                setError('No portal URL returned');
            }
        } catch (err) {
            const apiError = err as ApiResponse;
            setError(apiError.message || 'Failed to create portal session');
            console.error('Error creating portal session:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const daysRemaining = getDaysRemaining();
    const isTrialing = userSubscription?.status === 'trialing';

    // Find price IDs for each plan type
    const monthlyPlanPriceId = plans.find(plan => plan.planType === 'monthly')?.priceId;
    const annualPlanPriceId = plans.find(plan => plan.planType === 'annual')?.priceId;

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 3, sm: 2 },
            px: { xs: 1, sm: 0 }
        }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Current Subscription Status */}
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    borderRadius: 3,
                    overflow: 'hidden'
                }}
            >
                <Typography variant="subtitle1" color="primary.light" gutterBottom>
                    {t('dashboard.settings.subscription.currentStatus')}
                </Typography>

                {/* Plan Type */}
                {userSubscription?.plan_type && (
                    <PlanTypeDisplay planType={userSubscription.plan_type} />
                )}
                <Stack spacing={2}>
                    <Divider />

                    {/* Dates Section */}
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 3,
                        flexDirection: { xs: 'column', sm: 'row' }
                    }}>
                        {/* Trial Dates */}
                        {isTrialing && userSubscription?.trial_start && userSubscription?.trial_end && (
                            <TrialPeriodInfo
                                trialStart={userSubscription.trial_start}
                                trialEnd={userSubscription.trial_end}
                                daysRemaining={daysRemaining}
                                user={user}
                            />
                        )}

                        {/* Subscription Period */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            width: '100%',
                            gap: { xs: 2, sm: 0 }
                        }}>
                            {userSubscription?.current_period_start && userSubscription?.current_period_end && (
                                <SubscriptionPeriodInfo
                                    periodStart={userSubscription.current_period_start}
                                    periodEnd={userSubscription.current_period_end}
                                    status={userSubscription?.status as SubscriptionStatus}
                                    user={user}
                                />
                            )}

                            {/* Only show button when NOT in trial */}
                            {!isTrialing && (
                                <ManageSubscriptionButton
                                    onClick={handleManageSubscription}
                                    isLoading={isLoading}
                                />
                            )}
                        </Box>
                    </Box>
                </Stack>
            </Paper>

            {/* Available Plans */}
            {isTrialing && (
                <Paper
                    elevation={3}
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        overflow: 'hidden'
                    }}
                >
                    <Typography variant="subtitle1" color="primary.light" gutterBottom>
                        {t('dashboard.settings.subscription.availablePlans')}
                    </Typography>

                    {isLoadingPlans ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={2}
                            sx={{ mt: 1 }}
                        >
                            <PlanCard
                                planType="monthly"
                                handleSubscribe={handleSubscribe}
                                priceId={monthlyPlanPriceId}
                                isLoading={isLoading}
                            />
                            <PlanCard
                                planType="annual"
                                handleSubscribe={handleSubscribe}
                                priceId={annualPlanPriceId}
                                isLoading={isLoading}
                            />
                        </Stack>
                    )}
                </Paper>
            )}
        </Box>
    );
}
