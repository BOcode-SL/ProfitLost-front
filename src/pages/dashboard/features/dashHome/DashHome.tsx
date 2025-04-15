/**
 * DashHome Module
 * 
 * Primary dashboard landing page that provides a comprehensive overview
 * of the user's financial status and recent activity.
 * 
 * Key Features:
 * - Monthly financial summary metrics (income, expenses, net savings)
 * - Six-month financial trend visualization with historical context
 * - Recent transaction history with chronological display
 * - Optimized data fetching with consolidated API requests
 * - Responsive layout adapting to various screen sizes
 * - Live updates via transaction event listeners
 * 
 * @module DashHome
 */
import { useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// Services
import { transactionService } from '../../../../services/transaction.service';

// Types
import type { Transaction } from '../../../../types/supabase/transactions';

// Utils
import { TRANSACTION_UPDATED_EVENT } from '../../../../utils/events';

// Components
import HomeBalances from './components/HomeBalances';
import HomeChart from './components/HomeChart';
import HomeHistory from './components/HomeHistory';

/**
 * Interface for structured dashboard data segments
 * Organizes transaction data into specific time periods for different visualizations
 * 
 * @interface DashboardData
 */
interface DashboardData {
    /** Transactions from the current month for month-to-date analysis */
    currentMonthTransactions: Transaction[];
    
    /** Transactions from the previous month for month-over-month comparison */
    previousMonthTransactions: Transaction[];
    
    /** Last six months of transactions for trend analysis */
    sixMonthsTransactions: Transaction[];
    
    /** Most recent transactions across all time periods */
    recentTransactions: Transaction[];
}

/**
 * DashHome Component
 * 
 * Main dashboard container that fetches and organizes financial data
 * for display in various sub-components.
 * 
 * @returns {JSX.Element} Rendered dashboard home interface
 */
export default function DashHome() {
    const { t } = useTranslation();

    /**
     * State for segmented dashboard transaction data
     * Initialized with empty arrays for each data segment
     */
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        currentMonthTransactions: [],
        previousMonthTransactions: [],
        sixMonthsTransactions: [],
        recentTransactions: []
    });
    
    /** Loading state indicator for all dashboard components */
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Fetches optimized dashboard data in a single API call
     * Wrapped in useCallback to prevent unnecessary recreation on renders
     */
    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await transactionService.getDashboardData();
            if (!response.success) {
                throw new Error('Failed to fetch dashboard data');
            }
            
            // Ensure proper type validation before updating state
            if (response.data && 
                'currentMonthTransactions' in response.data && 
                'previousMonthTransactions' in response.data &&
                'sixMonthsTransactions' in response.data &&
                'recentTransactions' in response.data) {
                setDashboardData(response.data as DashboardData);
            } else {
                console.error('Invalid dashboard data format received');
                throw new Error('Invalid data format');
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error(t('dashboard.common.error.loading'));
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    /**
     * Fetch dashboard data on component mount
     * Initializes the dashboard with data
     */
    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    /**
     * Listen for transaction update events across the application
     * Refreshes dashboard data when transactions change elsewhere
     */
    useEffect(() => {
        window.addEventListener(TRANSACTION_UPDATED_EVENT, fetchDashboardData);
        
        return () => {
            window.removeEventListener(TRANSACTION_UPDATED_EVENT, fetchDashboardData);
        };
    }, [fetchDashboardData]);

    /**
     * Combined transaction set for balance calculations
     * Merges current and previous month for comparative analysis
     */
    const allTransactionsForBalance = [
        ...dashboardData.currentMonthTransactions,
        ...dashboardData.previousMonthTransactions
    ];

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
        }}>
            {/* Financial summary cards section */}
            <Box sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' }
            }}>
                {/* Income summary card */}
                <HomeBalances 
                    type="income" 
                    transactions={allTransactionsForBalance} 
                    isLoading={isLoading} 
                />
                {/* Expenses summary card */}
                <HomeBalances 
                    type="expenses" 
                    transactions={allTransactionsForBalance} 
                    isLoading={isLoading} 
                />
                {/* Net savings summary card */}
                <HomeBalances 
                    type="savings" 
                    transactions={allTransactionsForBalance} 
                    isLoading={isLoading} 
                />
            </Box>
            
            {/* Six-month financial trend visualization */}
            <HomeChart 
                transactions={dashboardData.sixMonthsTransactions} 
                isLoading={isLoading} 
            />
            
            {/* Recent transactions list */}
            <HomeHistory 
                transactions={dashboardData.recentTransactions} 
                isLoading={isLoading} 
            />
        </Box>
    );
}