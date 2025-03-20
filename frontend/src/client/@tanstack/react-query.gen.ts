// This file is auto-generated by @hey-api/openapi-ts

import { type Options, returnListApiV1HealthTestListGet, generateSvgFromPromptApiV1SvgGenerateSvgFromPromptPost, convertToSvgApiV1SvgConvertToSvgPost, getImageApiV1SvgImageImageNameGet, runRobotUsingSvgApiV1RobotRunWithSvgPost, runRobotUsingImageApiV1RobotRunWithImagePost, getPreviewApiV1RobotGetPreviewPost, getControlApiV1RobotGetControlPost, summarizeTextApiV1GptsummarizePost } from '../sdk.gen';
import { queryOptions, type UseMutationOptions } from '@tanstack/react-query';
import type { ReturnListApiV1HealthTestListGetData, GenerateSvgFromPromptApiV1SvgGenerateSvgFromPromptPostData, GenerateSvgFromPromptApiV1SvgGenerateSvgFromPromptPostError, ConvertToSvgApiV1SvgConvertToSvgPostData, ConvertToSvgApiV1SvgConvertToSvgPostError, GetImageApiV1SvgImageImageNameGetData, RunRobotUsingSvgApiV1RobotRunWithSvgPostData, RunRobotUsingSvgApiV1RobotRunWithSvgPostError, RunRobotUsingImageApiV1RobotRunWithImagePostData, RunRobotUsingImageApiV1RobotRunWithImagePostError, GetPreviewApiV1RobotGetPreviewPostData, GetPreviewApiV1RobotGetPreviewPostError, GetPreviewApiV1RobotGetPreviewPostResponse, GetControlApiV1RobotGetControlPostData, GetControlApiV1RobotGetControlPostError, GetControlApiV1RobotGetControlPostResponse, SummarizeTextApiV1GptsummarizePostData, SummarizeTextApiV1GptsummarizePostError, SummarizeTextApiV1GptsummarizePostResponse } from '../types.gen';
import type { AxiosError } from 'axios';
import { client as _heyApiClient } from '../client.gen';

export type QueryKey<TOptions extends Options> = [
    Pick<TOptions, 'baseURL' | 'body' | 'headers' | 'path' | 'query'> & {
        _id: string;
        _infinite?: boolean;
    }
];

const createQueryKey = <TOptions extends Options>(id: string, options?: TOptions, infinite?: boolean): [
    QueryKey<TOptions>[0]
] => {
    const params: QueryKey<TOptions>[0] = { _id: id, baseURL: (options?.client ?? _heyApiClient).getConfig().baseURL } as QueryKey<TOptions>[0];
    if (infinite) {
        params._infinite = infinite;
    }
    if (options?.body) {
        params.body = options.body;
    }
    if (options?.headers) {
        params.headers = options.headers;
    }
    if (options?.path) {
        params.path = options.path;
    }
    if (options?.query) {
        params.query = options.query;
    }
    return [
        params
    ];
};

export const returnListApiV1HealthTestListGetQueryKey = (options: Options<ReturnListApiV1HealthTestListGetData>) => createQueryKey('returnListApiV1HealthTestListGet', options);

export const returnListApiV1HealthTestListGetOptions = (options: Options<ReturnListApiV1HealthTestListGetData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await returnListApiV1HealthTestListGet({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: returnListApiV1HealthTestListGetQueryKey(options)
    });
};

export const generateSvgFromPromptApiV1SvgGenerateSvgFromPromptPostQueryKey = (options: Options<GenerateSvgFromPromptApiV1SvgGenerateSvgFromPromptPostData>) => createQueryKey('generateSvgFromPromptApiV1SvgGenerateSvgFromPromptPost', options);

export const generateSvgFromPromptApiV1SvgGenerateSvgFromPromptPostOptions = (options: Options<GenerateSvgFromPromptApiV1SvgGenerateSvgFromPromptPostData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await generateSvgFromPromptApiV1SvgGenerateSvgFromPromptPost({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: generateSvgFromPromptApiV1SvgGenerateSvgFromPromptPostQueryKey(options)
    });
};

export const generateSvgFromPromptApiV1SvgGenerateSvgFromPromptPostMutation = (options?: Partial<Options<GenerateSvgFromPromptApiV1SvgGenerateSvgFromPromptPostData>>) => {
    const mutationOptions: UseMutationOptions<unknown, AxiosError<GenerateSvgFromPromptApiV1SvgGenerateSvgFromPromptPostError>, Options<GenerateSvgFromPromptApiV1SvgGenerateSvgFromPromptPostData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await generateSvgFromPromptApiV1SvgGenerateSvgFromPromptPost({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const convertToSvgApiV1SvgConvertToSvgPostQueryKey = (options: Options<ConvertToSvgApiV1SvgConvertToSvgPostData>) => createQueryKey('convertToSvgApiV1SvgConvertToSvgPost', options);

export const convertToSvgApiV1SvgConvertToSvgPostOptions = (options: Options<ConvertToSvgApiV1SvgConvertToSvgPostData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await convertToSvgApiV1SvgConvertToSvgPost({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: convertToSvgApiV1SvgConvertToSvgPostQueryKey(options)
    });
};

export const convertToSvgApiV1SvgConvertToSvgPostMutation = (options?: Partial<Options<ConvertToSvgApiV1SvgConvertToSvgPostData>>) => {
    const mutationOptions: UseMutationOptions<unknown, AxiosError<ConvertToSvgApiV1SvgConvertToSvgPostError>, Options<ConvertToSvgApiV1SvgConvertToSvgPostData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await convertToSvgApiV1SvgConvertToSvgPost({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const getImageApiV1SvgImageImageNameGetQueryKey = (options: Options<GetImageApiV1SvgImageImageNameGetData>) => createQueryKey('getImageApiV1SvgImageImageNameGet', options);

export const getImageApiV1SvgImageImageNameGetOptions = (options: Options<GetImageApiV1SvgImageImageNameGetData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await getImageApiV1SvgImageImageNameGet({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: getImageApiV1SvgImageImageNameGetQueryKey(options)
    });
};

export const runRobotUsingSvgApiV1RobotRunWithSvgPostQueryKey = (options: Options<RunRobotUsingSvgApiV1RobotRunWithSvgPostData>) => createQueryKey('runRobotUsingSvgApiV1RobotRunWithSvgPost', options);

export const runRobotUsingSvgApiV1RobotRunWithSvgPostOptions = (options: Options<RunRobotUsingSvgApiV1RobotRunWithSvgPostData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await runRobotUsingSvgApiV1RobotRunWithSvgPost({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: runRobotUsingSvgApiV1RobotRunWithSvgPostQueryKey(options)
    });
};

export const runRobotUsingSvgApiV1RobotRunWithSvgPostMutation = (options?: Partial<Options<RunRobotUsingSvgApiV1RobotRunWithSvgPostData>>) => {
    const mutationOptions: UseMutationOptions<unknown, AxiosError<RunRobotUsingSvgApiV1RobotRunWithSvgPostError>, Options<RunRobotUsingSvgApiV1RobotRunWithSvgPostData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await runRobotUsingSvgApiV1RobotRunWithSvgPost({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const runRobotUsingImageApiV1RobotRunWithImagePostQueryKey = (options: Options<RunRobotUsingImageApiV1RobotRunWithImagePostData>) => createQueryKey('runRobotUsingImageApiV1RobotRunWithImagePost', options);

export const runRobotUsingImageApiV1RobotRunWithImagePostOptions = (options: Options<RunRobotUsingImageApiV1RobotRunWithImagePostData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await runRobotUsingImageApiV1RobotRunWithImagePost({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: runRobotUsingImageApiV1RobotRunWithImagePostQueryKey(options)
    });
};

export const runRobotUsingImageApiV1RobotRunWithImagePostMutation = (options?: Partial<Options<RunRobotUsingImageApiV1RobotRunWithImagePostData>>) => {
    const mutationOptions: UseMutationOptions<unknown, AxiosError<RunRobotUsingImageApiV1RobotRunWithImagePostError>, Options<RunRobotUsingImageApiV1RobotRunWithImagePostData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await runRobotUsingImageApiV1RobotRunWithImagePost({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const getPreviewApiV1RobotGetPreviewPostQueryKey = (options: Options<GetPreviewApiV1RobotGetPreviewPostData>) => createQueryKey('getPreviewApiV1RobotGetPreviewPost', options);

export const getPreviewApiV1RobotGetPreviewPostOptions = (options: Options<GetPreviewApiV1RobotGetPreviewPostData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await getPreviewApiV1RobotGetPreviewPost({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: getPreviewApiV1RobotGetPreviewPostQueryKey(options)
    });
};

export const getPreviewApiV1RobotGetPreviewPostMutation = (options?: Partial<Options<GetPreviewApiV1RobotGetPreviewPostData>>) => {
    const mutationOptions: UseMutationOptions<GetPreviewApiV1RobotGetPreviewPostResponse, AxiosError<GetPreviewApiV1RobotGetPreviewPostError>, Options<GetPreviewApiV1RobotGetPreviewPostData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await getPreviewApiV1RobotGetPreviewPost({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const getControlApiV1RobotGetControlPostQueryKey = (options: Options<GetControlApiV1RobotGetControlPostData>) => createQueryKey('getControlApiV1RobotGetControlPost', options);

export const getControlApiV1RobotGetControlPostOptions = (options: Options<GetControlApiV1RobotGetControlPostData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await getControlApiV1RobotGetControlPost({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: getControlApiV1RobotGetControlPostQueryKey(options)
    });
};

export const getControlApiV1RobotGetControlPostMutation = (options?: Partial<Options<GetControlApiV1RobotGetControlPostData>>) => {
    const mutationOptions: UseMutationOptions<GetControlApiV1RobotGetControlPostResponse, AxiosError<GetControlApiV1RobotGetControlPostError>, Options<GetControlApiV1RobotGetControlPostData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await getControlApiV1RobotGetControlPost({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const summarizeTextApiV1GptsummarizePostQueryKey = (options: Options<SummarizeTextApiV1GptsummarizePostData>) => createQueryKey('summarizeTextApiV1GptsummarizePost', options);

export const summarizeTextApiV1GptsummarizePostOptions = (options: Options<SummarizeTextApiV1GptsummarizePostData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await summarizeTextApiV1GptsummarizePost({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: summarizeTextApiV1GptsummarizePostQueryKey(options)
    });
};

export const summarizeTextApiV1GptsummarizePostMutation = (options?: Partial<Options<SummarizeTextApiV1GptsummarizePostData>>) => {
    const mutationOptions: UseMutationOptions<SummarizeTextApiV1GptsummarizePostResponse, AxiosError<SummarizeTextApiV1GptsummarizePostError>, Options<SummarizeTextApiV1GptsummarizePostData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await summarizeTextApiV1GptsummarizePost({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};