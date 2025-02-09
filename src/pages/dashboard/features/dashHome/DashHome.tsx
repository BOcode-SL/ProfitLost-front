import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// Services
import { transactionService } from '../../../../services/transaction.service';

// Types
import type { Transaction } from '../../../../types/models/transaction';

// Components
import HomeBalances from './components/HomeBalances';
import HomeChart from './components/HomeChart';
import HomeHistory from './components/HomeHistory';

// DashHome component
export default function DashHome() {
    const { t } = useTranslation();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all transactions
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await transactionService.getAllTransactions();
                if (!response.success) {
                    throw new Error('Failed to fetch transactions');
                }
                setTransactions(response.data as Transaction[]);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                toast.error(t('dashboard.common.error.loading'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [t]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
        }}>
            <Box sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' }
            }}>
                <HomeBalances type="income" transactions={transactions} isLoading={isLoading} />
                <HomeBalances type="expenses" transactions={transactions} isLoading={isLoading} />
                <HomeBalances type="savings" transactions={transactions} isLoading={isLoading} />
            </Box>
            <HomeChart transactions={transactions} isLoading={isLoading} />
            <HomeHistory transactions={transactions} isLoading={isLoading} />
        </Box>
    );
}