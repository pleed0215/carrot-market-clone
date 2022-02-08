import type { NextPage } from 'next';
import FloatingButton from '@components/floating-button';
import Item from '@components/item';
import Layout from '@components/layout';
import useSWR from 'swr';
import type { Product } from '@prisma/client';

type ProductWithFavoriteCount = Product & { _count: { favorites: number } };

const Home: NextPage = () => {
    const { data, isValidating } =
        useSWR<ProductWithFavoriteCount[]>('/api/items');
    return (
        <Layout title="홈" hasTabBar>
            <div className="flex flex-col space-y-5 divide-y">
                {isValidating && <div>Loading...</div>}
                {data &&
                    data.map((item, i) => (
                        <Item
                            id={item.id}
                            key={item.id}
                            title={item.name}
                            price={item.price}
                            comments={1}
                            hearts={item._count.favorites}
                        />
                    ))}
                <FloatingButton href="/items/upload">
                    <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                </FloatingButton>
            </div>
        </Layout>
    );
};

export default Home;
