import type { RequestEvent } from '@sveltejs/kit';

export const createContext = async (event: RequestEvent) => {
    return {
        ...event,
        session: event.locals.session,
        user: event.locals.user,
    };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
