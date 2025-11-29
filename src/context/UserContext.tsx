'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getProfile, saveProfile } from '@/lib/storage';

export interface UserProfile {
    name: string;
    bio: string;
    avatar?: string;
    coverImage?: string;
    createdAt: number;
}

interface UserContextType {
    profile: UserProfile | null;
    isLoading: boolean;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const { address } = useAccount();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!address) {
            setProfile(null);
            setIsLoading(false);
            return;
        }

        const loadProfile = async () => {
            setIsLoading(true);
            try {
                const data = await getProfile(address);
                if (data) {
                    setProfile(data);
                } else {
                    // Initialize new profile
                    const newProfile: UserProfile = {
                        name: `User ${address.slice(0, 6)}`,
                        bio: '',
                        createdAt: Date.now(),
                    };
                    setProfile(newProfile);
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [address]);

    const updateProfile = async (data: Partial<UserProfile>) => {
        if (!address || !profile) return;

        const updatedProfile = { ...profile, ...data };
        setProfile(updatedProfile);
        await saveProfile(address, updatedProfile);
    };

    return (
        <UserContext.Provider value={{ profile, isLoading, updateProfile }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
