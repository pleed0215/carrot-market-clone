import { useEffect, useState } from 'react';
import type { User } from '@prisma/client';
import CarrotResponse from '@libs/server/carrotResponse';
import { useRouter } from 'next/router';

export default function useUser() {
    const [user, setUser] = useState<User>();
    const router = useRouter();
    useEffect(() => {
        fetch('/api/users/me')
            .then((res) => res.json())
            .then(({ response }) => {
                if (response.code !== 200) {
                    return router.replace('/enter');
                } else {
                    setUser(response.data.user);
                }
            });
    }, [router]);
    return user;
}
