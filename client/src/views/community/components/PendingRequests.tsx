import { IndividualCommunityType, JoinRequest } from '@/@types/community'
import { Card } from '@/components/ui'
import { apiGetJoinRequests } from '@/services/CommunityService'
import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PendingRequestsTable from './PendingRequestsTable'

export default function PendingRequests({
    community,
}: {
    community: IndividualCommunityType
}) {
    const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([])
    const fetchTrigger = useAppSelector(
        (state) => state.community.community.fetchTrigger
    )

    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const join_requests = await apiGetJoinRequests(String(id) ?? '')
                if (join_requests.status === 200) {
                    setJoinRequests(join_requests.data as JoinRequest[])
                }
                // fetch join_requests data
                console.log('fetching join_requests')
            } catch (error) {
                console.error('Error fetching join_requests', error)
            }
        }

        fetchMembers()
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
                <PendingRequestsTable joinRequests={joinRequests} />
            </Card>
        </div>
    )
}
