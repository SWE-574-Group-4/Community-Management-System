import { Card } from '@/components/ui'
import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
import { apiGetBadges } from '@/services/UserService'
import { BadgeType } from '@/@types/user'
import BadgesTable from './BadgesTable'

export default function Badges() {
    const [badges, setBadges] = useState<BadgeType[]>([])
    const fetchTrigger = useAppSelector(
        (state) => state.community.community.fetchTrigger
    )

    const userId = useAppSelector((state) => state.auth.user?.id)

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const response = await apiGetBadges(String(userId) ?? '')
                if (response.status === 200) {
                    setBadges(response.data as BadgeType[])
                }
                // fetch badges data
                console.log('fetching badges')
            } catch (error) {
                console.error('Error fetching badges', error)
            }
        }

        fetchBadges()
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
                <BadgesTable badges={badges} />
            </Card>
        </div>
    )
}
