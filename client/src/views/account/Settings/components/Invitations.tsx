import { Card } from '@/components/ui'
import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
import InvitationsTable from './InvitationsTable'
import { apiGetInvitations } from '@/services/UserService'
import { InvitationsType } from '@/@types/user'

export default function Invitations() {
    const [invitations, setInvitations] = useState<InvitationsType[]>([]) // TODO: Change to Invitations type
    const fetchTrigger = useAppSelector(
        (state) => state.community.community.fetchTrigger
    )

    const userId = useAppSelector((state) => state.auth.user?.id)

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const invitations = await apiGetInvitations(
                    String(userId) ?? ''
                )
                if (invitations.status === 200) {
                    setInvitations(invitations.data as InvitationsType[])
                }
                // fetch invitations data
                console.log('fetching invitations')
            } catch (error) {
                console.error('Error fetching invitations', error)
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
                <InvitationsTable invitations={invitations} />
            </Card>
        </div>
    )
}
