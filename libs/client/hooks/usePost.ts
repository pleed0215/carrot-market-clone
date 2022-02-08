import { useCallback, useState } from 'react';

// T: request body 타입, R: response 타입.
type UsePostResult<T, R> = [
    mutateFunc: UsePostMutateFunc<T>,
    state: UsePostState<R>,
];
type UsePostMutateFunc<T> = (data?: T) => void;
type UsePostState<R> = {
    loading: boolean;
    data?: R | undefined | null;
    error?: string | undefined | null;
};
type UsePostOptions<R> = {
    onFinish?: (data: R) => void;
};

export default function usePost<T = any, R = any>(
    url: string | null,
    options?: UsePostOptions<R>,
): UsePostResult<T, R> {
    const [data, setData] = useState<R | null>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>();

    const mutateFunc = useCallback(
        (inputData?: T) => {
            setLoading(true);
            setData(undefined);
            setError(undefined);
            if (url) {
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
                    .then((json) => {
                        setData(json);
                        if (options && json && options.onFinish) {
                            options.onFinish(json);
                        }
                    })
                    .catch((error) => setError(error.message))
                    // TODO: onFinish 호출 타임이 좀 이상함. 제대로 호출이 안됨.
                    // 아마도 finally가 내가 생각하는 것보다 빠르게 호출이 되어서, state의
                    // setData에서 data가 설정되는 시간과 finally 간에 시간 차이가 있어서
                    // data가 undefined일 때 onFinish가 호출된 것으로 추정된다.
                    // 지금은 그래서 코드를 위로 올려서 state update 전에 작업할 수 있도록 해놨다.
                    .finally(() => {
                        setLoading(false);
                    });
            }
        },
        [url, options],
    );

    return [mutateFunc, { data, loading, error }];
}
