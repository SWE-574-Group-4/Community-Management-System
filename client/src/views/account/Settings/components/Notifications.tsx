import { Card } from '@/components/ui'
import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
import { apiGetNotifications } from '@/services/UserService'
import { NotificationType } from '@/@types/user'
import BadgesTable from './BadgesTable'
import NotificationsTable from './NotificationsTable'

export default function Notifications() {
    const [notifications, setNotifications] = useState<NotificationType[]>([]) // TODO: Change to Invitations type
    const fetchTrigger = useAppSelector(
        (state) => state.community.community.fetchTrigger
    )

    const userId = useAppSelector((state) => state.auth.user?.id)

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await apiGetNotifications(String(userId) ?? '')
                if (response.status === 200) {
                    setNotifications(response.data as NotificationType[])
                }
                // fetch invitations data
                console.log('fetching invitations')
            } catch (error) {
                console.error('Error fetching invitations', error)
            }
        }

        fetchNotifications()
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
                <NotificationsTable notifications={notifications} />
            </Card>
        </div>
    )
}
