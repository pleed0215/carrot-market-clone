export default class CarrotResponse<T = any> {
    code: number;
    message?: string | null;
    description?: string | null;
    path?: string | null;
    data?: T | undefined | null;

    constructor(code: number, detail?: CarrotResponseDetailType<T>) {
        this.code = code;
        if (detail) {
            this.setDetail(detail);
        }
    }
    static builder<T = any>(code: number) {
        return new CarrotResponseBuilder<T>(code);
    }
    static factory<T = any>(
        code: number,
        detail?: CarrotResponseDetailType,
    ): CarrotResponse<T> {
        const response =
            responseExceptionsDict[code] ??
            new CarrotResponse<T>(code, { message: 'Unknown response' });
        if (detail) {
            response.setDetail(detail);
        }
        return response;
    }

    public isOk() {
        return this.code >= 200 && this.code < 300;
    }

    private setDetail(detail: CarrotResponseDetailType) {
        const { message, description, path, data } = detail;
        this.message = message;
        this.description = description;
        this.path = path;
        this.data = data;
    }
}

type CarrotResponseDetailType<T = any> = {
    message?: string | null;
    description?: string | null;
    path?: string | null;
    data?: T | null;
};

type CarrotResponseDictType = {
    [key: number]: CarrotResponse;
};

const BadRequestException = new CarrotResponse(400, { message: 'Bad request' });
const UnauthorizedException = new CarrotResponse(401, {
    message: 'Unauthorized',
});
const ForbiddenException = new CarrotResponse(403, { message: 'Forbidden' });
const NotFoundException = new CarrotResponse(404, { message: 'Not found' });
const NotAllowedMethodException = new CarrotResponse(405, {
    message: 'Not allowed',
});

const responseExceptionsDict: CarrotResponseDictType = {
    400: BadRequestException,
    401: UnauthorizedException,
    403: ForbiddenException,
    404: NotFoundException,
    405: NotAllowedMethodException,
};

class CarrotResponseBuilder<T = any> {
    private readonly response: CarrotResponse<T>;

    constructor(code: number) {
        this.response = new CarrotResponse<T>(code);
    }

    setCode(value: number) {
        this.response.code = value;
        return this;
    }

    setMessage(value: string | undefined | null) {
        this.response.message = value;
        return this;
    }

    setDescription(value: string | null) {
        this.response.description = value;
        return this;
    }

    setPath(value: string | undefined | null) {
        this.response.path = value;
        return this;
    }

    setData(value: any) {
        this.response.data = value;
        return this;
    }

    build() {
        return this.response;
    }
}
