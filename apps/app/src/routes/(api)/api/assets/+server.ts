// TODO rename this file once it's secured
// Reference implementation of R2 multi-part file uploads
import type { RequestHandler } from './$types';

import { type R2Error } from '@cloudflare/workers-types';
import { Log } from '@kitql/helpers';
import { ulid } from 'ulid';
import z from 'zod';

const mpuLog = new Log('MPU');

const CompleteMultipartUploadSchema = z.object({
    parts: z
        .array(
            z.object({
                partNumber: z.number(),
                etag: z.string(),
            }),
        )
        .min(1),
});

const MPU_POST_ACTIONS: Record<string, RequestHandler> = {
    /**
     * TODO: might move this into tRPC
     */
    create: async ({ locals }) => {
        // will probably need to add a path here to properly segment things to tenancies? idk
        const uploadKey = ulid();
        const multipartUpload = await locals.R2.createMultipartUpload(uploadKey);
        return new Response(
            JSON.stringify({
                key: multipartUpload.key,
                uploadId: multipartUpload.uploadId,
            }),
        );
    },
    /**
     * TODO: might move this into tRPC
     */
    complete: async ({ locals, url, request }) => {
        const key = url.searchParams.get('key');
        const uploadId = url.searchParams.get('uploadId');

        if (!key || !uploadId) {
            mpuLog.error('Key or UploadID not specified in complete endpoint');
            return new Response(null, {
                status: 400,
            });
        }

        const multipartUpload = locals.R2.resumeMultipartUpload(key, uploadId);

        const maybeCompleteBody = CompleteMultipartUploadSchema.safeParse(await request.json());

        if (maybeCompleteBody.error) {
            mpuLog.error('complete endpoint body invalid');
            return new Response(null, {
                status: 400,
            });
        }

        const completeBody = maybeCompleteBody.data;

        try {
            const object = await multipartUpload.complete(completeBody.parts);
            mpuLog.success(`completed multipart upload for "${key}"`);
            return new Response(null, {
                headers: {
                    etag: object.etag,
                },
            });
        } catch (e: unknown) {
            const error = e as R2Error;
            mpuLog.error(`failed to complete multipart upload: ${error.message}`);
            return new Response(error.message, {
                status: 400,
            });
        }
    },
};

const MPU_PUT_ACTIONS: Record<string, RequestHandler> = {
    /**
     * Due to body being needed with blob, cannot be pu in tRPC
     */
    uploadpart: async ({ url, request, locals }) => {
        const key = url.searchParams.get('key');
        const uploadId = url.searchParams.get('uploadId');
        const partNumber = parseInt(url.searchParams.get('partNumber') ?? '');

        if (!key || !uploadId || !partNumber || isNaN(partNumber)) {
            mpuLog.error('uploadpart endpoint missing query params');
            return new Response(null, {
                status: 400,
            });
        }

        if (request.body === null) {
            mpuLog.error('uploadpart endpoint had no body');
            return new Response(null, {
                status: 400,
            });
        }

        const multipartUpload = locals.R2.resumeMultipartUpload(key, uploadId);

        try {
            const uploadedPart = await multipartUpload.uploadPart(
                partNumber,
                await request.arrayBuffer(),
            );
            mpuLog.success(`uploaded part success for part ${partNumber}`);
            return new Response(JSON.stringify(uploadedPart));
        } catch (e: unknown) {
            const error = e as R2Error;
            mpuLog.error(`uploadpart action failed due to: ${error.message}`);
            return new Response(error.message, { status: 400 });
        }
    },
};

const MPU_GET_ACTIONS: Record<string, RequestHandler> = {
    /**
     * Response is blob, cannot be tRPC but this may be moved elsewhere
     */
    get: async ({ url, locals }) => {
        const key = url.searchParams.get('key');

        if (!key) {
            mpuLog.error('get endpoint had no key');
            return new Response(null, {
                status: 400,
            });
        }

        const object = await locals.R2.get(key);

        if (!object) {
            mpuLog.error('get endpoint requested invalid object');
            return new Response(null, {
                status: 404,
            });
        }

        // ah yes cloudflare
        const headers = new Headers();
        // @ts-expect-error todo: ensure this *actually* works becuase these have 2 seperate header types
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);

        mpuLog.success(`got asset "${key}"`);
        return new Response(await object.arrayBuffer(), { headers });
    },
};

const MPU_DELETE_ACTIONS: Record<string, RequestHandler> = {
    /**
     * TODO: might move this into tRPC
     */
    abort: async ({ locals, url }) => {
        const key = url.searchParams.get('key');
        const uploadId = url.searchParams.get('uploadId');
        if (!key || !uploadId) {
            mpuLog.error('abort endpoint missing query params');
            return new Response(null, {
                status: 400,
            });
        }

        const multipartUpload = locals.R2.resumeMultipartUpload(key, uploadId);

        try {
            await multipartUpload.abort();
        } catch (e: unknown) {
            const error = e as R2Error;
            mpuLog.error(`abort failed due to: ${error}`);
            return new Response(error.message, {
                status: 400,
            });
        }

        mpuLog.success(`successfully aborted "${key}"`);
        return new Response(null, {
            status: 204,
        });
    },

    /**
     * TODO: might move this into tRPC
     */
    delete: async ({ locals, url }) => {
        const key = url.searchParams.get('key');
        if (!key) {
            mpuLog.error('delete endpoint missing query params');
            return new Response(null, {
                status: 400,
            });
        }

        try {
            await locals.R2.delete(key);
        } catch (e: unknown) {
            const error = e as R2Error;
            // only like this because i have an extension that thinks this is sql
            mpuLog.error(` delete failed due to: ${error}`.trimStart());
            return new Response(error.message, {
                status: 400,
            });
        }

        mpuLog.success(`successfully deleted "${key}"`);
        return new Response(null, {
            status: 204,
        });
    },
};

export const POST: RequestHandler = async (event) => {
    const action = event.url.searchParams.get('action');
    if (action && action in MPU_POST_ACTIONS) {
        return await MPU_POST_ACTIONS[action](event);
    } else {
        return new Response(null, {
            status: 400,
        });
    }
};

export const PUT: RequestHandler = async (event) => {
    const action = event.url.searchParams.get('action');
    if (action && action in MPU_PUT_ACTIONS) {
        return await MPU_PUT_ACTIONS[action](event);
    } else {
        return new Response(null, {
            status: 400,
        });
    }
};

export const GET: RequestHandler = async (event) => {
    const action = event.url.searchParams.get('action');
    if (action && action in MPU_GET_ACTIONS) {
        return await MPU_GET_ACTIONS[action](event);
    } else {
        return new Response(null, {
            status: 400,
        });
    }
};

export const DELETE: RequestHandler = async (event) => {
    const action = event.url.searchParams.get('action');
    if (action && action in MPU_DELETE_ACTIONS) {
        return await MPU_DELETE_ACTIONS[action](event);
    } else {
        return new Response(null, {
            status: 400,
        });
    }
};
