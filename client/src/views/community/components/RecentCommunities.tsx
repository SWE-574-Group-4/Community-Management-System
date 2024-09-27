import { Card } from '@/components/ui'
import RecentCommunity from './RecentCommunity'
import { useEffect, useState } from 'react'
import { apiGetCommunityList } from '@/services/CommunityService'
import { CommunityType, IndividualCommunityType } from '@/@types/community'
import { useAppSelector } from '@/store'
import { ActionLink } from '@/components/shared'

export default function RecentCommunities() {
    const [communities, setCommunities] = useState<IndividualCommunityType[]>(
        []
    )
    const userId = useAppSelector((state) => state.auth.user?.id)

    useEffect(() => {
        const fetchDefaultTemplate = async () => {
            const resp = await apiGetCommunityList(userId ?? '')
            if (resp.status == 200) {
                setCommunities(resp.data as IndividualCommunityType[])
            }
        }
        fetchDefaultTemplate()
    }, [])

    const renderedCommunities = communities.slice(0, 5)

    return (
        <div>
            <h3>Recent Communities</h3>
            <Card className="mt-3 h-75 overflow-auto cursor-pointer">
                {renderedCommunities.map((community) => (
                    <RecentCommunity key={community.id} community={community} />
                ))}
                <ActionLink to={'/communities'}>{'See all'}</ActionLink>
            </Card>
        </div>
    )
}
