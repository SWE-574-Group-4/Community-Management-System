import { IndividualCommunityType, Member } from '@/@types/community'
import { Button, Card } from '@/components/ui'
import {
    apiJoinCommunity,
    apiLeaveCommunity,
} from '@/services/CommunityService'
import { toggleFetchTrigger, useAppSelector } from '@/store'
import { formatDate } from '@/utils/helpers'
import useRequestWithNotification from '@/utils/hooks/useRequestWithNotification'
import { FaCrown, FaRegEdit } from 'react-icons/fa'
import {
    HiLockClosed,
    HiLockOpen,
    HiOutlineDocumentAdd,
    HiPencil,
} from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function CommunityDetail({
    community,
}: {
    community: IndividualCommunityType
}) {
    console.log(community)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const fetchTrigger = useAppSelector(
        (state) => state.community.community.fetchTrigger
    )
    const userId = useAppSelector((state) => state.auth.user?.id)
    const { id, members, num_members, name, description, is_public, is_owner } =
        community

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
                disabled={community.is_owner}
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

        if (community.is_member) {
            return generateButton('Leave', handleLeaveCommunity as Function)
        } else if (!community.is_public) {
            if (community.has_user_requested && !community.is_member) {
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

    const renderEditButton = () => {
        return (
            <Button
                className="bg-blue-500 text-white flex items-center gap-x-1"
                size="sm"
                variant="solid"
                onClick={() => navigate(`/community/${id}/edit`)}
            >
                Edit
                <HiPencil />
            </Button>
        )
    }

    const cardFooter = (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
                {renderButton()}
                {is_owner && renderEditButton()}
            </div>

            <span className="flex items-center">
                <div>
                    <h6 className="text-sm">Last Activity</h6>
                    <span className="text-xs">
                        {formatDate(community.updated_at)}
                    </span>
                </div>
            </span>
        </div>
    )

    const Members = () => {
        return (
            <div className="members mt-5">
                Community Members
                {members &&
                    members.length > 0 &&
                    members.map((item: Member) => {
                        return <p>{item.firstname + ' ' + item.lastname}</p>
                    })}
            </div>
        )
    }

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
                        <br />
                        {is_owner && (
                            <div className="flex text-yellow-300 items-center">
                                <FaCrown className=" mr-1 " />{' '}
                                <span>Owner</span>
                            </div>
                        )}
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
                {/* <Members /> */}
            </Card>
            <Button
                disabled={!community.is_member}
                className="mt-5 flex items-center justify-center gap-x-0.5"
                size="sm"
                variant="twoTone"
                color="emerald-600"
                block
                onClick={() =>
                    navigate(`/community/${id}/post`, {
                        state: { community },
                    })
                }
            >
                <HiOutlineDocumentAdd className="" />
                <span>Post</span>
            </Button>
        </div>
    )
}
