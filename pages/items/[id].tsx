import type { NextPage } from 'next';
import Link from 'next/link';
import Button from '@components/button';
import Layout from '@components/layout';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import type { Product, User } from '@prisma/client';
import usePost from '@libs/client/hooks/usePost';
import { cls } from '@libs/client/utils';

type ItemDetailDataType = {
    item: Product & { user: User; _count: { favorites: number } };
    related: Product[];
};

const ItemDetail: NextPage = () => {
    const router = useRouter();
    const { data, isValidating } = useSWR<ItemDetailDataType>(
        router.query.id ? `/api/items/${router.query.id}` : null,
    );
    const { data: favData, mutate } = useSWR(
        router.query.id ? `/api/items/${router.query.id}/fav` : null,
    );
    const [toggleFavorite, { loading }] = usePost(
        router.query.id ? `/api/items/${router.query.id}/fav` : null,
    );
    const onClickToggleFavorite = async () => {
        await mutate({ isFav: !favData.isFav }, false);
        toggleFavorite();
    };
    return (
        <Layout canGoBack>
            {isValidating && <div>Loading...</div>}
            {data && (
                <div className="px-4  py-4">
                    <div className="mb-8">
                        <div className="h-96 bg-slate-300" />
                        <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-slate-300" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    <Link href={`/users/${data.item.userId}`}>
                                        {data.item.name}
                                    </Link>
                                </p>
                                <p className="text-xs font-medium text-gray-500">
                                    <Link href={`/users/${data.item.userId}`}>
                                        View profile &rarr;
                                    </Link>
                                </p>
                            </div>
                        </div>
                        <div className="mt-5">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {data.item.name}
                            </h1>
                            <span className="text-2xl block mt-3 text-gray-900">
                                ${data.item.price}
                            </span>
                            <p className=" my-6 text-gray-700">
                                ${data.item.description}
                            </p>
                            <div className="flex items-center justify-between space-x-2">
                                <Button large text="Talk to seller" />
                                <button
                                    className={cls(
                                        'p-3 rounded-md flex items-center justify-center hover:bg-gray-100',
                                        favData && favData.isFav
                                            ? 'text-red-400 hover:text-red-500'
                                            : 'text-gray-400 hover:text-gray-500',
                                    )}
                                    onClick={onClickToggleFavorite}
                                >
                                    <svg
                                        className="h-6 w-6 "
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill={
                                            favData && favData.isFav
                                                ? 'currentColor'
                                                : 'none'
                                        }
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            fillRule={'evenodd'}
                                            clipRule={'evenodd'}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Similar items
                        </h2>
                        <div className=" mt-6 grid grid-cols-2 gap-4">
                            {data.related.map((related, i) => (
                                <Link
                                    key={related.id}
                                    passHref
                                    href={`/items/${related.id}`}
                                >
                                    <div>
                                        <div className="h-56 w-full mb-4 bg-slate-300" />
                                        <h3 className="text-gray-700 -mb-1">
                                            {related.name}
                                        </h3>
                                        <span className="text-sm font-medium text-gray-900">
                                            {related.price}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ItemDetail;
