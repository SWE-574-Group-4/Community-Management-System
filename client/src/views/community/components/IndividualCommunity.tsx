import { IndividualCommunityType } from '@/@types/community'
import { Button, Card, Notification, toast } from '@/components/ui'
import {
    apiIsUserInCommunity,
    apiJoinCommunity,
    apiLeaveCommunity,
} from '@/services/CommunityService'
import { toggleFetchTrigger, useAppSelector } from '@/store'
import { formatDate } from '@/utils/helpers'
import useRequestWithNotification from '@/utils/hooks/useRequestWithNotification'
import { useEffect, useState } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { HiLockClosed, HiLockOpen } from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function IndividualCommunity({
    community,
}: {
    community: IndividualCommunityType
}) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const fetchTrigger = useAppSelector(
        (state) => state.community.community.fetchTrigger
    )
    const userId = useAppSelector((state) => state.auth.user?.id)
    const {
        id,
        is_member,
        is_owner,
        is_public,
        has_user_requested,
        updated_at,
        name,
        description,
        num_members,
        members,
    } = community

    const [handleJoinCommunity, isJoining] = useRequestWithNotification(
        apiJoinCommunity,
        'You have successfully joined the community!',
        'Error joining community',
        () => dispatch(toggleFetchTrigger())
    )

    const [handleLeaveCommunity, isLeaving] = useRequestWithNotification(
        apiLeaveCommunity,
        'You have successfully left the community!',
        'Error leaving community',
        () => dispatch(toggleFetchTrigger())
    )

    const renderButton = () => {
        const generateButton = (text: string, handler: Function) => (
            <Button
                disabled={is_owner}
                className="bg-blue-500 text-white"
                size="sm"
                variant="solid"
                onClick={() =>
                    typeof handler === 'function' &&
                    handler(String(id) ?? '', userId ?? '')
                }
            >
                {text}
            </Button>
        )

        if (is_member) {
            return generateButton('Leave', handleLeaveCommunity as Function)
        } else if (!is_public) {
            if (has_user_requested && !is_member) {
                return generateButton(
                    'Cancel Request',
                    handleLeaveCommunity as Function
                )
            } else {
                return generateButton(
                    'Request to Join',
                    handleJoinCommunity as Function
                )
            }
        } else {
            return generateButton('Join', handleJoinCommunity as Function)
        }
    }

    const cardFooter = (
        <div className="flex items-center justify-between">
            {renderButton()}
            <span className="flex items-center">
                <FaExternalLinkAlt
                    className="mr-2"
                    size={'20'}
                    onClick={() => navigate(`/community/${id}/details`)}
                />
                <div>
                    <h6 className="text-sm">Last Activity</h6>
                    <span className="text-xs">{formatDate(updated_at)}</span>
                </div>
            </span>
        </div>
    )

    return (
        <div className="max-w-xl mb-5">
            <Card
                clickable
                className="hover:shadow-lg transition duration-150 ease-in-out dark:border dark:border-gray-600 dark:border-solid"
                footer={cardFooter}
                headerClass="p-0"
                footerBorder={false}
                headerBorder={false}
            >
                <div className="w-full flex justify-between">
                    <span className="text-emerald-600 font-semibold">
                        {num_members || members?.length} members, 20 posts
                    </span>
                    <span className="font-semibold">
                        {is_public ? (
                            <p className="underline text-emerald-600">
                                Public{' '}
                                <HiLockOpen className="inline-block ml-2 " />
                            </p>
                        ) : (
                            <p className="underline">
                                Private
                                <HiLockClosed className="inline-block ml-2" />
                            </p>
                        )}
                    </span>
                </div>
                <h4 className="font-bold my-3">{name}</h4>
                <p>{description}</p>
            </Card>
        </div>
    )
}
