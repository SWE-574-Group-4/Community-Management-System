import { Card } from '@/components/ui'
import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
import { apiGetCommunityBadges, apiGetUserCommunityBadges } from '@/services/CommunityService'
import { useParams } from 'react-router-dom'
import { BadgeType } from '@/@types/user'
import BadgesTable from './CommunityBadgesTable'

export default function Badges() {
    const [badges, setBadges] = useState<BadgeType[]>([])
    const [userBadges, setUserBadges] = useState<BadgeType[]>([])
    const fetchTrigger = useAppSelector(
        (state) => state.community.community.fetchTrigger
    )

    const { id: communityId } = useParams<{ id: string }>()
    const userId = useAppSelector((state) => state.auth.user?.id)

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                if (communityId) {
                    const response = await apiGetUserCommunityBadges(userId, communityId);
                    if (response.status === 200) {
                        const filteredBadges = (response.data as BadgeType[]).filter((badge: BadgeType) => {
                            return (
                                (badge.criteria && !('selected_user' in badge.criteria)) ||
                                badge.criteria?.selected_user === userId
                            );
                        });
                        setBadges(filteredBadges);
                        console.log('Filtered badges fetched');
                    }
                } else {
                    console.error('Community ID is undefined');
                }
            } catch (error) {
                console.error('Error fetching badges', error);
            }
        };
    
        fetchBadges();
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
                <BadgesTable badges={badges} />
            </Card>
        </div>
    )
}
