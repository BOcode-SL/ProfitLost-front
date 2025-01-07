import { Box } from '@mui/material';
import './DashboardContent.scss';

interface DashboardContentProps {
    activeSection: string;
}

const DashboardContent = ({ activeSection }: DashboardContentProps) => {
    return (
        <Box className='dashboard__content'>
            <Box
            >
                <h4>{activeSection}</h4>
            </Box>
        </Box>
    );
};

export default DashboardContent;
