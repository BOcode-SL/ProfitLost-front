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

// DashHome component
export default function DashHome() {
    const { t } = useTranslation();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Function to fetch all transactions, wrapped in useCallback to prevent unnecessary recreation
    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await transactionService.getAllTransactions();
            if (!response.success) {
                throw new Error('Failed to fetch transactions');
            }
            // Explicitly cast to Transaction[] since we're migrating from models to supabase types
            if (Array.isArray(response.data)) {
                setTransactions(response.data as Transaction[]);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error(t('dashboard.common.error.loading'));
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    // Fetch all transactions on component mount
    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    // Listen for transaction update events and refresh data
    useEffect(() => {
        window.addEventListener(TRANSACTION_UPDATED_EVENT, fetchTransactions);
        
        return () => {
            window.removeEventListener(TRANSACTION_UPDATED_EVENT, fetchTransactions);
        };
    }, [fetchTransactions]);

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
                <HomeBalances type="income" transactions={transactions} isLoading={isLoading} />
                <HomeBalances type="expenses" transactions={transactions} isLoading={isLoading} />
                <HomeBalances type="savings" transactions={transactions} isLoading={isLoading} />
            </Box>
            {/* Six-month financial trend visualization */}
            <HomeChart transactions={transactions} isLoading={isLoading} />
            {/* Recent transactions list */}
            <HomeHistory transactions={transactions} isLoading={isLoading} />
        </Box>
    );
}