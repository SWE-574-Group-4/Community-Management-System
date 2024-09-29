import React from 'react'
import { formatDate } from '@/utils/helpers'
import { IndividualCommunityType } from '@/@types/community'
import { useNavigate } from 'react-router-dom'

export default function IndividualCommunity({
    community,
}: {
    community: IndividualCommunityType
}) {
    const { id, updated_at, name, num_members } = community
    const navigate = useNavigate()
    const handleClick = () => {
        navigate(`/community/${id}/details`)
    }

    return (
        <div className="community-card mb-2" onClick={handleClick}>
            <p className="text-white font-bold">{name}</p>
            <p className="inline-flex">{num_members} Members</p>
            <p className="inline-flex ml-2">10 Posts</p>
            <p className="italic mb-4">
                Recent activity: {formatDate(updated_at)}
            </p>
        </div>
    )
}
