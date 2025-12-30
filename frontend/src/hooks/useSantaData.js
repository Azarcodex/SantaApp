import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDeliveries, fetchElves, fetchToys, fetchSystemHealth, updateDeliveryStatus, updateElfStatus, reassignTasks, assignTask, autoBalanceElves } from '../services/api';
import toast from 'react-hot-toast';

export const useDeliveries = () => {
    return useQuery({
        queryKey: ['deliveries'],
        queryFn: fetchDeliveries,
        refetchInterval: 5000,
    });
};

export const useElves = (filters = {}) => {
    return useQuery({
        queryKey: ['elves', filters],
        queryFn: () => fetchElves(filters),
        refetchInterval: 5000,
        keepPreviousData: true,
    });
};

export const useElfMutations = () => {
    const queryClient = useQueryClient();

    const updateStatus = useMutation({
        mutationFn: updateElfStatus,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['elves']);
            toast.success(`Status updated for ${data.name}`);
        }
    });

    const reassign = useMutation({
        mutationFn: reassignTasks,
        onSuccess: () => {
            queryClient.invalidateQueries(['elves']);
            toast.success('Tasks reassigned successfully');
        }
    });

    const assign = useMutation({
        mutationFn: assignTask,
        onSuccess: () => {
            queryClient.invalidateQueries(['elves']);
            toast.success('Task assigned successfully');
        }
    });

    const autoBalance = useMutation({
        mutationFn: autoBalanceElves,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['elves']);
            toast.success(`Balanced ${data.movedTasks} tasks!`);
        }
    });

    return { updateStatus, reassign, assign, autoBalance };
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
            toast.success('Delivery status updated');
        }
    });
};
