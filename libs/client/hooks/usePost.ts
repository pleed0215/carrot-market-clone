import { useState } from 'react';

// T: request body 타입, R: response 타입.
type UsePostResult<T, R> = [
    mutateFunc: UsePostMutateFunc<T>,
    state: UsePostState<R>,
];
type UsePostMutateFunc<T> = (data: T) => void;
type UsePostState<R> = {
    loading: boolean;
    data?: R | undefined | null;
    error?: string | undefined | null;
};
type UsePostOptions<R> = {
    onFinish?: (data: R) => void;
};

export default function usePost<T = any, R = any>(
    url: string,
    options?: UsePostOptions<R>,
): UsePostResult<T, R> {
    const [data, setData] = useState<R | null>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>();

    const mutateFunc = (inputData: T) => {
        setLoading(true);
        setData(undefined);
        setError(undefined);
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputData),
        })
            .then(async (res) => {
                try {
                    // body stream은 한 번만 읽을 수 있으므로, 복제해서 사용.
                    const cloned = res.clone();
                    return await cloned.json();
                } catch (e) {
                    return await res.text();
                }
            })
            .then(setData)
            .catch((error) => setError(error.message))
            .finally(() => {
                setLoading(false);
                if (options && data && options.onFinish) {
                    options.onFinish(data);
                }
            });
    };

    return [mutateFunc, { data, loading, error }];
}
