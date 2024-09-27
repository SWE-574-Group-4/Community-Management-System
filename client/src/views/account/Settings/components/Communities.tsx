import { Card } from '@/components/ui'
import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
import InvitationsTable from './InvitationsTable'
import { apiGetUserCommunities } from '@/services/UserService'
import { InvitationsType } from '@/@types/user'
import { CommunityType } from '@/@types/community'
import CommunitiesTable from './CommunitiesTable'

export default function Communities() {
    const [communities, setCommunities] = useState<CommunityType[]>([]) // TODO: Change to Invitations type
    const fetchTrigger = useAppSelector(
        (state) => state.community.community.fetchTrigger
    )

    const userId = useAppSelector((state) => state.auth.user?.id)

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const communities = await apiGetUserCommunities(
                    String(userId) ?? ''
                )
                if (communities.status === 200) {
                    setCommunities(communities.data as CommunityType[])
                }
                // fetch communities data
                console.log('fetching communities')
            } catch (error) {
                console.error('Error fetching communities', error)
            }
        }

        fetchInvitations()
    }, [fetchTrigger])

    return (
        <div className="mb-5">
            <Card
                clickable
                className="hover:shadow-lg transition duration-150 ease-in-out dark:border dark:border-gray-600 dark:border-solid"
                headerClass="p-0"
                footerBorder={false}
                headerBorder={false}
            >
                <CommunitiesTable communities={communities} />
            </Card>
        </div>
    )
}
