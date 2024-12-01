// pages/Followers.tsx
import { Card } from '@/components/ui';
import { useAppSelector } from '@/store';
import { useEffect, useState } from 'react';
import { getFollowing } from '@/services/UserService';
import { FollowerType } from '@/@types/user';
import FollowingTable from './FollowingTable';

export default function Followings() {
    const [following, setFollowings] = useState<FollowerType[]>([]);
    const fetchTrigger = useAppSelector(
        (state) => state.community.community.fetchTrigger
    );
    const userId = useAppSelector((state) => state.auth.user?.id);
    console.log('userId', userId);
    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                if (!userId) return;
                const response = await getFollowing(userId);
                if (response.status === 200) {
                    setFollowings(response.data as FollowerType[]);
                }
                console.log('fetching following');

            } catch (error) {
                console.error('Error fetching following', error);
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
                <FollowingTable followings={following} />
            </Card>
        </div>
    );
}
