// This file is auto-generated by @hey-api/openapi-ts

export type BodyRunRobotUsingImageApiV1RobotRunWithImagePost = {
    /**
     * Image file that should be used by the robot to paint
     */
    img_file: Blob | File;
};

export type BodyRunRobotUsingSvgApiV1RobotRunWithSvgPost = {
    /**
     * SVG file that is used to run the model
     */
    svg_file: Blob | File;
};

export type HttpValidationError = {
    detail?: Array<ValidationError>;
};

export type SumUpResponse = {
    text: string;
};

export type TextToSumUp = {
    text: string;
};

export type ValidationError = {
    loc: Array<string | number>;
    msg: string;
    type: string;
};

export type GenerateSvgFromPromptApiV1SvgGenerateFromPromptPostData = {
    body?: never;
    path?: never;
    query: {
        md_text: string;
        /**
         * Auth token
         */
        token: string;
    };
    url: '/api/v1/svg/generate_from_prompt';
};

export type GenerateSvgFromPromptApiV1SvgGenerateFromPromptPostErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type GenerateSvgFromPromptApiV1SvgGenerateFromPromptPostError = GenerateSvgFromPromptApiV1SvgGenerateFromPromptPostErrors[keyof GenerateSvgFromPromptApiV1SvgGenerateFromPromptPostErrors];

export type GenerateSvgFromPromptApiV1SvgGenerateFromPromptPostResponses = {
    /**
     * Successful Response
     */
    200: unknown;
};

export type RunRobotUsingSvgApiV1RobotRunWithSvgPostData = {
    body: BodyRunRobotUsingSvgApiV1RobotRunWithSvgPost;
    path?: never;
    query: {
        /**
         * Auth token
         */
        token: string;
    };
    url: '/api/v1/robot/run_with_svg';
};

export type RunRobotUsingSvgApiV1RobotRunWithSvgPostErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type RunRobotUsingSvgApiV1RobotRunWithSvgPostError = RunRobotUsingSvgApiV1RobotRunWithSvgPostErrors[keyof RunRobotUsingSvgApiV1RobotRunWithSvgPostErrors];

export type RunRobotUsingSvgApiV1RobotRunWithSvgPostResponses = {
    /**
     * Successful Response
     */
    200: unknown;
};

export type RunRobotUsingImageApiV1RobotRunWithImagePostData = {
    body: BodyRunRobotUsingImageApiV1RobotRunWithImagePost;
    path?: never;
    query: {
        /**
         * Auth token
         */
        token: string;
    };
    url: '/api/v1/robot/run-with-image';
};

export type RunRobotUsingImageApiV1RobotRunWithImagePostErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type RunRobotUsingImageApiV1RobotRunWithImagePostError = RunRobotUsingImageApiV1RobotRunWithImagePostErrors[keyof RunRobotUsingImageApiV1RobotRunWithImagePostErrors];

export type RunRobotUsingImageApiV1RobotRunWithImagePostResponses = {
    /**
     * Successful Response
     */
    200: unknown;
};

export type SummarizeTextApiV1GptsummarizePostData = {
    body: TextToSumUp;
    path?: never;
    query: {
        /**
         * Auth token
         */
        token: string;
    };
    url: '/api/v1/gptsummarize';
};

export type SummarizeTextApiV1GptsummarizePostErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type SummarizeTextApiV1GptsummarizePostError = SummarizeTextApiV1GptsummarizePostErrors[keyof SummarizeTextApiV1GptsummarizePostErrors];

export type SummarizeTextApiV1GptsummarizePostResponses = {
    /**
     * Successful Response
     */
    200: SumUpResponse;
};

export type SummarizeTextApiV1GptsummarizePostResponse = SummarizeTextApiV1GptsummarizePostResponses[keyof SummarizeTextApiV1GptsummarizePostResponses];

export type ClientOptions = {
    baseURL: `${string}://${string}` | (string & {});
};