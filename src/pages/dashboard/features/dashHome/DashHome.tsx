/**
 * DashHome Component
 * 
 * Main dashboard home page that displays an overview of financial data.
 * Features include:
 * - Monthly financial summaries (income, expenses, savings)
 * - Six-month financial trend chart
 * - Recent transaction history
 * - Responsive layout adapting to different screen sizes
 * - Loading states while data is being fetched
 */
import { useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// Services
import { transactionService } from '../../../../services/transaction.service';

// Types
import type { Transaction } from '../../../../types/supabase/transaction';

// Utils
import { TRANSACTION_UPDATED_EVENT } from '../../../../utils/events';

// Components
import HomeBalances from './components/HomeBalances';
import HomeChart from './components/HomeChart';
import HomeHistory from './components/HomeHistory';

// Interface for dashboard data structure
interface DashboardData {
    currentMonthTransactions: Transaction[];
    previousMonthTransactions: Transaction[];
    sixMonthsTransactions: Transaction[];
    recentTransactions: Transaction[];
}

// DashHome component
export default function DashHome() {
    const { t } = useTranslation();

    const [dashboardData, setDashboardData] = useState<DashboardData>({
        currentMonthTransactions: [],
        previousMonthTransactions: [],
        sixMonthsTransactions: [],
        recentTransactions: []
    });
    const [isLoading, setIsLoading] = useState(true);

    // Function to fetch optimized dashboard data, wrapped in useCallback to prevent unnecessary recreation
    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await transactionService.getDashboardData();
            if (!response.success) {
                throw new Error('Failed to fetch dashboard data');
            }
            
            // Ensure proper type conversion
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

    // Fetch dashboard data on component mount
    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Listen for transaction update events and refresh data
    useEffect(() => {
        window.addEventListener(TRANSACTION_UPDATED_EVENT, fetchDashboardData);
        
        return () => {
            window.removeEventListener(TRANSACTION_UPDATED_EVENT, fetchDashboardData);
        };
    }, [fetchDashboardData]);

    // Combine transactions for balance calculations
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
            {/* Financial summary cards (income, expenses, savings) */}
            <Box sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' }
            }}>
                <HomeBalances 
                    type="income" 
                    transactions={allTransactionsForBalance} 
                    isLoading={isLoading} 
                />
                <HomeBalances 
                    type="expenses" 
                    transactions={allTransactionsForBalance} 
                    isLoading={isLoading} 
                />
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