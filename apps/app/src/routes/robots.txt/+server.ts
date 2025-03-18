import type { RequestHandler } from './$types';

const ROBOTS_TXT = `
User-Agent: *
Disallow: *
`;

export const GET: RequestHandler = () => {
    return new Response(ROBOTS_TXT.trim());
};
