export default class ResponseException {
    message: string;
    code: number;
    path?: string | null;
    description?: string | null;

    constructor(message: string, code: number) {
        this.message = message;
        this.code = code;
    }

    static factory(
        code: number,
        detail?: ResponseExceptionFactoryOptions,
    ): ResponseException {
        const exception =
            responseExceptionsDict[code] ??
            new ResponseException('Unknown exception', code);
        return { ...exception, ...(detail && { detail }) };
    }
}

type ResponseExceptionDict = {
    [key: number]: ResponseException;
};
type ResponseExceptionFactoryFn = (
    code: number,
    options?: ResponseExceptionFactoryOptions,
) => ResponseException;
type ResponseExceptionFactoryOptions = {
    path?: string;
    description?: string;
};

const BadRequestException = new ResponseException('Bad request', 400);
const UnauthorizedException = new ResponseException('Unauthorized', 401);
const ForbiddenException = new ResponseException('Forbidden', 403);
const NotFoundException = new ResponseException('Not found', 404);
const NotAllowedMethodException = new ResponseException(
    'Not allowed method',
    405,
);

const responseExceptionsDict: ResponseExceptionDict = {
    400: BadRequestException,
    401: UnauthorizedException,
    403: ForbiddenException,
    404: NotFoundException,
    405: NotAllowedMethodException,
};
