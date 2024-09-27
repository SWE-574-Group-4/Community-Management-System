import { useEffect, useState } from 'react'
import { IndividualCommunityType } from '@/@types/community'
import { useAppSelector } from '@/store'
import { apiGetCommunity } from '@/services/CommunityService'

export const useFetchCommunity = (id: string, fetchTrigger: any) => {
    const userId = useAppSelector((state) => state.auth.user?.id)
    const [community, setCommunity] = useState<IndividualCommunityType | null>(
        null
    )

    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                // fetch community data
                const resp = await apiGetCommunity(id ?? '', userId ?? '')

                if (resp.status === 200) {
                    setCommunity(resp.data as IndividualCommunityType)
                } else if (resp.status === 404) {
                    // community not found
                    console.log('Community not found')
                }
            } catch (error) {
                console.error('Error fetching community:', error)

                if ((error as any).response?.status === 404) {
                    console.log('Community not found')
                }
            }
        }
        fetchCommunity()
    }, [id, fetchTrigger])

    return community
}
