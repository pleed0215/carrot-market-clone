import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div className="w-full max-w-xl mx-auto">
            <SWRConfig
                value={{
                    fetcher: (url: string) =>
                        fetch(url).then((res) => res.json()),
                }}
            >
                <Component {...pageProps} />
            </SWRConfig>
        </div>
    );
}

export default MyApp;
