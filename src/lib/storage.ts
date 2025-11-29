import type { UserProfile } from '@/context/UserContext';

const STORAGE_KEY = 'cuddly_disco_profiles';

export const getProfile = async (address: string): Promise<UserProfile | null> => {
    if (typeof window === 'undefined') return null;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        const profiles = JSON.parse(stored);
        return profiles[address.toLowerCase()] || null;
    } catch (error) {
        console.error('Error reading profile from storage:', error);
        return null;
    }
};

export const saveProfile = async (address: string, profile: UserProfile): Promise<void> => {
    if (typeof window === 'undefined') return;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const profiles = stored ? JSON.parse(stored) : {};

        profiles[address.toLowerCase()] = profile;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    } catch (error) {
        console.error('Error saving profile to storage:', error);
    }
};
