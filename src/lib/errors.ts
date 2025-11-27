// Custom error classes
export class WalletError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'WalletError';
    }
}

export class IPFSError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'IPFSError';
    }
}

export class ContractError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ContractError';
    }
}

export class NetworkError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NetworkError';
    }
}

// Error handling utilities
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'An unknown error occurred';
}

export function isUserRejection(error: unknown): boolean {
    const message = getErrorMessage(error).toLowerCase();
    return message.includes('user rejected') ||
        message.includes('user denied') ||
        message.includes('user cancelled');
}

export function handleError(error: unknown, context?: string): void {
    const message = getErrorMessage(error);
    console.error(`Error${context ? ` in ${context}` : ''}:`, message);

    // You can add error reporting service here (e.g., Sentry)
    // reportToSentry(error, context);
}
