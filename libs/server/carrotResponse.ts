// TODO: CarrotResponse와 ResponseException 코드 합쳐야 함. 중복 코드임
export default class CarrotResponse<T = any> {
    code: number;
    message?: string | null;
    description?: string | null;
    path?: string | null;
    data?: T | undefined | null;

    constructor(code: number) {
        this.code = code;
    }
    static builder<T = any>(code: number) {
        return new CarrotResponseBuilder<T>(code);
    }
}

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
