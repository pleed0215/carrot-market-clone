import { useEffect, useState } from 'react';
import type { User } from '@prisma/client';
import { useRouter } from 'next/router';
import useSWR from 'swr';

export default function useUser() {
    const { data, error } = useSWR('/api/users/me');
    const router = useRouter();

    useEffect(() => {
        if (data && data.response.code !== 200) {
            router.replace('/enter');
        }
    }, [data, router]);

    return {
        user: data?.response.data.user as User,
        isLoading: !data && !error,
        error,
    };
}
