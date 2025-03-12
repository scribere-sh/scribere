export interface UserActionMessage {
    kind: 'success' | 'error';
    message: string;
}

export const MESSAGES: Record<string, UserActionMessage> = {
    'logged-out': {
        kind: 'success',
        message: 'Logged Out!'
    }
} as const;

export const MESSAGE_VARIANTS = Object.keys(MESSAGES);
