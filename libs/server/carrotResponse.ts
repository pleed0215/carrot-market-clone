export default class CarrotResponse {
    code: number;
    message?: string | null;
    description?: string | null;
    path?: string | null;
    data?: any;

    constructor(code: number) {
        this.code = code;
    }
    static builder(code: number) {
        return new CarrotResponseBuilder(code);
    }
}

class CarrotResponseBuilder {
    private response: CarrotResponse;

    constructor(code: number) {
        this.response = new CarrotResponse(code);
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
