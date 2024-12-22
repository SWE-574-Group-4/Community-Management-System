// pages/Followers.tsx
import { Card } from '@/components/ui';
import { useAppSelector } from '@/store';
import { useEffect, useState } from 'react';
import { getFollowers } from '@/services/UserService';
import { FollowerType } from '@/@types/user';
import FollowersTable from './FollowersTable';

export default function Followers() {
    const [followers, setFollowers] = useState<FollowerType[]>([]);
    const fetchTrigger = useAppSelector(
        (state) => state.community.community.fetchTrigger
    );
    const userId = useAppSelector((state) => state.auth.user?.id);
    console.log('userId', userId);
    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                if (!userId) return;
                const response = await getFollowers(userId);
                if (response.status === 200) {
                    setFollowers(response.data as FollowerType[]);
                }
                console.log('fetching followers');

            } catch (error) {
                console.error('Error fetching followers', error);
            }
        };

        fetchFollowers();
    }, [fetchTrigger]);

    return (
        <div className="mb-5">
            <Card
                clickable
                className="hover:shadow-lg transition duration-150 ease-in-out dark:border dark:border-gray-600 dark:border-solid"
                headerClass="p-0"
                footerBorder={false}
                headerBorder={false}
            >
                <FollowersTable followers={followers} />
            </Card>
        </div>
    );
}
