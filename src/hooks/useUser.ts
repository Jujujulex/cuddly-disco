import { useUser } from '@/context/UserContext';

export const useUserProfile = () => {
    return useUser();
};
