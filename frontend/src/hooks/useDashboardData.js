import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '../services/api';

export const useDashboardData = () => {
    return useQuery({
        queryKey: ['dashboardData'],
        queryFn: fetchDashboardData,
        refetchInterval: 5000, // Poll every 5 seconds
    });
};
