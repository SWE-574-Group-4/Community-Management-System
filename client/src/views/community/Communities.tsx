import { IndividualCommunityType } from '@/@types/community'
import { apiGetCommunityList } from '@/services/CommunityService'
import React, { useEffect } from 'react'
import IndividualCommunity from './components/IndividualCommunity'
import { useAppSelector } from '@/store'

export default function Communities() {
    const [communities, setCommunities] = React.useState<
        IndividualCommunityType[]
    >([]) // Update initial state

    const fetchTrigger = useAppSelector(
        (state) => state.community.community.fetchTrigger
    ) // Add this line
    const userId = useAppSelector((state) => state.auth.user?.id)

    React.useEffect(() => {
        // Fetch communities
        const fetchCommunities = async () => {
            try {
                const response = await apiGetCommunityList(userId)
                const data = response.data as IndividualCommunityType[] // Add type assertion here
                setCommunities(data)
            } catch (error) {
                console.error('Error fetching communities:', error)
            }
        }

        fetchCommunities()
    }, [fetchTrigger]) // Add fetchTrigger to dependency array

    return (
        <div>
            {communities.map((community) => (
                <IndividualCommunity key={community.id} community={community} />
            ))}
        </div>
    )
}
