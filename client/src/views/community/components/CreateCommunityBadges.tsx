// CommunityBadges.tsx
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Formik, Form, Field } from 'formik'
import { d } from '@vite-pwa/assets-generator/shared/assets-generator.5e51fd40'
import { apiSetCommunityBadges } from '@/services/CommunityService'
import AddCommunityBadgeForm from './AddCommunityBadgeForm'

export default function CommunityBadges() {
    const [badges, setBadges] = useState<
        {
            id: string
            name: string
            description: string
            tier: string
            criteria: string
        }[]
    >([])
    const { id: communityId } = useParams<{ id: string }>()

    useEffect(() => {
        // Fetch existing badges for the community
        if (communityId) {
            axios
                .get(`/community/${communityId}/badges/`)
                .then((response) => {
                    setBadges(response.data)
                })
                .catch((error) => {
                    console.error(
                        'There was an error fetching the badges!',
                        error
                    )
                })
        }
    }, [communityId])

    return (
        <div className="min-h-fit">
            <h2>Create Badge</h2>
            <AddCommunityBadgeForm />
            <ul>
                {badges.map((badge) => (
                    <li key={badge.id}>
                        <div>{badge.name}</div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
