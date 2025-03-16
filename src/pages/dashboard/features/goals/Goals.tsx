import { useState, useEffect, useMemo } from 'react';
import { Box, Paper, Button, Fade, Skeleton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import type { Goal } from '../../../../types/models/goal';
import GoalCard from './components/GoalCard';
import GoalForm from './components/GoalForm';
import DrawerBase from '../../components/ui/DrawerBase';

const mockGoals: Goal[] = [
    {
        _id: '1',
        user_id: 'user1',
        name: 'Save for a Car',
        type: 'Saving',
        targetAmount: 20000,
        currentAmount: 20000,
        deadline: '2024-12-31T23:59:59.999Z',
        history: [
            { date: '2024-01-15T10:00:00.000Z', amount: 5000 },
            { date: '2024-02-15T10:00:00.000Z', amount: 5000 },
            { date: '2024-03-15T10:00:00.000Z', amount: 10000 }
        ],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-03-15T10:00:00.000Z'
    },
    {
        _id: '2',
        user_id: 'user1',
        name: 'Master Degree',
        type: 'Goal',
        targetAmount: 30000,
        currentAmount: 15000,
        deadline: '2026-09-01T23:59:59.999Z',
        history: [
            { date: '2023-06-01T10:00:00.000Z', amount: 5000 },
            { date: '2023-12-01T10:00:00.000Z', amount: 5000 },
            { date: '2024-03-01T10:00:00.000Z', amount: 5000 }
        ],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2024-03-01T10:00:00.000Z'
    },
    {
        _id: '3',
        user_id: 'user1',
        name: 'Emergency Fund',
        type: 'Saving',
        targetAmount: 10000,
        currentAmount: 1000,
        history: [
            { date: '2024-01-01T10:00:00.000Z', amount: 500 },
            { date: '2024-02-01T10:00:00.000Z', amount: 500 }
        ],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-02-01T10:00:00.000Z'
    },
    {
        _id: '4',
        user_id: 'user1',
        name: 'Investment Portfolio',
        type: 'Investment',
        targetAmount: 50000,
        currentAmount: 15000,
        deadline: '2025-12-30T23:59:59.999Z',
        history: [
            { date: '2024-01-15T10:00:00.000Z', amount: 5000 },
            { date: '2024-02-15T10:00:00.000Z', amount: 5000 },
            { date: '2024-03-15T10:00:00.000Z', amount: 5000 }
        ],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-03-15T10:00:00.000Z'
    },
    {
        _id: '5',
        user_id: 'user1',
        name: 'Pay Student Loan',
        type: 'Debt',
        targetAmount: 25000,
        currentAmount: 20000,
        deadline: '2023-12-31T23:59:59.999Z',
        history: [
            { date: '2023-03-15T10:00:00.000Z', amount: 10000 },
            { date: '2023-06-15T10:00:00.000Z', amount: 5000 },
            { date: '2023-09-15T10:00:00.000Z', amount: 5000 }
        ],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-09-15T10:00:00.000Z'
    },
    {
        _id: '6',
        user_id: 'user1',
        name: 'World Trip',
        type: 'Saving',
        targetAmount: 15000,
        currentAmount: 3000,
        deadline: '2025-06-30T23:59:59.999Z',
        history: [
            { date: '2023-12-15T10:00:00.000Z', amount: 1000 },
            { date: '2024-01-15T10:00:00.000Z', amount: 1000 },
            { date: '2024-02-15T10:00:00.000Z', amount: 1000 }
        ],
        createdAt: '2023-12-01T00:00:00.000Z',
        updatedAt: '2024-02-15T10:00:00.000Z'
    }
];

export default function Goals() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>(undefined);
    const currentYear = new Date().getUTCFullYear();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);

    const yearsWithData = useMemo(() => {
        const years = new Set<number>();
        const currentYear = new Date().getUTCFullYear();

        goals.forEach(goal => {
            const startYear = new Date(goal.createdAt).getUTCFullYear();
            let endYear;

            if (goal.deadline) {
                endYear = Math.min(new Date(goal.deadline).getUTCFullYear(), currentYear);
            } else {
                endYear = currentYear;
            }

            for (let year = startYear; year <= endYear; year++) {
                years.add(year);
            }
        });

        return Array.from(years).sort((a, b) => b - a);
    }, [goals]);

    const filteredGoals = useMemo(() => {
        const currentYear = new Date().getUTCFullYear();

        return goals.filter(goal => {
            const startYear = new Date(goal.createdAt).getUTCFullYear();
            let endYear;

            if (goal.deadline) {
                // Caso 1 y 2: Si tiene deadline, usar ese año como límite
                endYear = Math.min(new Date(goal.deadline).getUTCFullYear(), currentYear);
            } else {
                // Caso 3: Si no tiene deadline, mostrar hasta el año actual
                endYear = currentYear;
            }

            return selectedYear >= startYear && selectedYear <= endYear;
        });
    }, [goals, selectedYear]);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setGoals(mockGoals);
            setLoading(false);
        }, 1000);
    }, []);

    const handleSubmit = (goalData: Omit<Goal, '_id' | 'user_id' | 'createdAt' | 'updatedAt'>) => {
        if (selectedGoal) {
            // Actualizar goal existente
            setGoals(goals.map(goal =>
                goal._id === selectedGoal._id
                    ? {
                        ...goal,
                        ...goalData,
                        currentAmount: goalData.history.reduce((sum, entry) => sum + entry.amount, 0),
                        updatedAt: new Date().toISOString()
                    }
                    : goal
            ));
        } else {
            // Crear nuevo goal
            const newGoal: Goal = {
                _id: Date.now().toString(),
                user_id: 'user1',
                ...goalData,
                currentAmount: goalData.history.reduce((sum, entry) => sum + entry.amount, 0),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            setGoals([...goals, newGoal]);
        }
        handleClose();
    };

    const handleClose = () => {
        setFormOpen(false);
        setSelectedGoal(undefined);
    };

    return (
        <Fade in timeout={400}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Paper elevation={2} sx={{
                    p: 1,
                    borderRadius: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <FormControl size="small" fullWidth sx={{ minWidth: 120 }}>
                        <InputLabel>Year</InputLabel>
                        <Select
                            value={selectedYear}
                            label="Year"
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                        >
                            {yearsWithData.map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        startIcon={<span className='material-symbols-rounded'>add</span>}
                        onClick={() => setFormOpen(true)}
                        size="small"
                        sx={{
                            whiteSpace: 'nowrap',
                            minWidth: 'fit-content'
                        }}
                    >
                        Add Goal
                    </Button>
                </Paper>

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: 'repeat(auto-fit, minmax(450px, 1fr))'
                    },
                    gap: 2,
                    width: '100%',
                    '& > *': {
                        width: '100%',
                        maxWidth: '100%'
                    }
                }}>
                    {loading ? (
                        [...Array(3)].map((_, index) => (
                            <Skeleton
                                key={index}
                                variant="rectangular"
                                height={200}
                                sx={{ borderRadius: 3 }}
                            />
                        ))
                    ) : (
                        filteredGoals.map((goal) => (
                            <GoalCard
                                key={goal._id}
                                goal={goal}
                                onClick={() => {
                                    setSelectedGoal(goal);
                                    setFormOpen(true);
                                }}
                            />
                        ))
                    )}
                </Box>

                <DrawerBase
                    open={formOpen}
                    onClose={handleClose}
                >
                    <GoalForm
                        goal={selectedGoal}
                        onSubmit={handleSubmit}
                        onClose={handleClose}
                    />
                </DrawerBase>
            </Box>
        </Fade>
    );
}