import { toast } from 'svelte-sonner';

export interface UserActionMessage {
    kind?: 'success' | 'warning' | 'error';
    message: string;
}

export const AUTH_MESSAGES: Record<string, UserActionMessage> = {
    'logged-out': {
        kind: 'success',
        message: 'Successfully Signed Out!'
    },
    'password-changed': {
        kind: 'success',
        message: 'Successfully Changed Password!'
    }
} as const;

export const AUTH_MESSAGE_VARIANTS = Object.keys(AUTH_MESSAGES);

export const APP_MESSAGES: Record<string, UserActionMessage> = {
    'reset-mfa': {
        kind: 'warning',
        message: 'Recovery Code used, MFA Reset.'
    }
};

export const APP_MESSAGE_VARIANTS = Object.keys(APP_MESSAGES);

const messageKindToToastFunction = (kind: UserActionMessage['kind']) => {
    switch (kind) {
        case 'success':
            return toast.success;
        case 'warning':
            return toast.warning;
        case 'error':
            return toast.error;
        default:
            return toast;
    }
};

export const openAuthMessage = (message: string | undefined) => {
    if (!message || message.trim().length === 0) return;

    const msg = AUTH_MESSAGES[message];

    messageKindToToastFunction(msg.kind)(msg.message);
};

export const openAppMessage = (message: string | undefined) => {
    if (!message || message.trim().length === 0) return;

    const msg = APP_MESSAGES[message];

    messageKindToToastFunction(msg.kind)(msg.message);
};
