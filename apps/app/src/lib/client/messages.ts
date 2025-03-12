export interface UserActionMessage {
    kind: 'success' | 'error';
    message: string;
}

export const MESSAGES: Record<string, UserActionMessage> = {
    'logged-out': {
        kind: 'success',
        message: 'Successfully Signed Out!'
    },
    'password-changed': {
        kind: 'success',
        message: 'Successfully Changed Password!'
    }
} as const;

export const MESSAGE_VARIANTS = Object.keys(MESSAGES);
