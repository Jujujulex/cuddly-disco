'use client'

import { useEffect } from 'react';
import { useToast } from '@/context/ToastContext';

interface UseTransactionStatusProps {
    hash?: `0x${string}`;
    isSuccess: boolean;
    error?: Error | null;
}

export function useTransactionStatus({ hash, isSuccess, error }: UseTransactionStatusProps) {
    const toast = useToast();

    useEffect(() => {
        if (isSuccess && hash) {
            toast.success('Transaction confirmed successfully!');
        }
    }, [isSuccess, hash, toast]);

    useEffect(() => {
        if (error) {
            const errorMessage = error.message || 'Transaction failed';
            toast.error(errorMessage);
        }
    }, [error, toast]);

    return {
        hash,
        isSuccess,
        error,
    };
}
