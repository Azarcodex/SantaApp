import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDeliveries, fetchElves, fetchToys, fetchSystemHealth, updateDeliveryStatus } from '../services/api';

export const useDeliveries = () => {
    return useQuery({
        queryKey: ['deliveries'],
        queryFn: fetchDeliveries,
        refetchInterval: 5000,
    });
};

export const useElves = () => {
    return useQuery({
        queryKey: ['elves'],
        queryFn: fetchElves,
        refetchInterval: 10000,
    });
};

export const useToys = () => {
    return useQuery({
        queryKey: ['toys'],
        queryFn: fetchToys,
        refetchInterval: 5000,
    });
};

export const useSystemHealth = () => {
    return useQuery({
        queryKey: ['systemHealth'],
        queryFn: fetchSystemHealth,
        refetchInterval: 5000,
    });
};

export const useUpdateDelivery = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateDeliveryStatus,
        onSuccess: () => {
            queryClient.invalidateQueries(['deliveries']);
        },
    });
};
