import { Community, Post } from '@/@types/user'
import { ActionLink } from '@/components/shared'
import FollowButton from '@/views/profile/FollowButton'
import { apiGetUserInformation, isFollowing } from '@/services/UserService'
import { useAppSelector } from '@/store'
import useFetchData from '@/utils/hooks/useFetchData'
import { AxiosResponse } from 'axios'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { apiGetBadges } from '@/services/UserService'
import { BadgeType } from '@/@types/user'

type CustomerInfoFieldProps = {
    title?: string
    value?: string
}

const CustomerInfoField = ({ title, value }: CustomerInfoFieldProps) => {
    return (
        <div>
            <span>{title}</span>
            <p className="text-gray-700 dark:text-gray-200 font-semibold">
                {!!value ? value : ' - '}
            </p>
        </div>
    )
}

export default function Profile() {
    const { id: userId } = useParams<{ id: string }>()
    const authUser = useAppSelector((state) => state.auth.user)

    // Fetch user information using the provided userId
    const userInfo = useFetchData<AxiosResponse>(apiGetUserInformation, [
        userId,
    ])
    const userFollowing = useFetchData<AxiosResponse>(isFollowing, [
        userId,
        authUser?.id,
    ])
    const isFollowingUser = userFollowing?.data ?? false

    const {
        id,
        firstname,
        lastname,
        email,
        username,
        // dob,
        country,
        short_info,
        posts,
        communities,
    } = userInfo?.data || {}

    const [badges, setBadges] = useState<BadgeType[]>([])
    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const response = await apiGetBadges(String(userId) ?? '')
                setBadges(response.data as BadgeType[])
            } catch (error) {
                console.error('Error fetching badges:', error)
            }
        }

        if (userId) {
            fetchBadges()
        }
    }, [userId])

    return (
        <div>
            {authUser?.id === userId && 'This is your profile page'}
            {/* Follow Button for other users */}
            {authUser?.id !== id && id !== undefined && (
                <div className="mt-4">
                    <FollowButton
                        userId={id}
                        authUserId={authUser?.id}
                        isFollowed={isFollowingUser}
                    />
                </div>
            )}
            <div className="grid grid-cols-1 xl:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4 mt-8">
                <CustomerInfoField
                    title="Full Name"
                    value={`${firstname} ${lastname}`}
                />
                <CustomerInfoField title="Email" value={email} />

                {/* Username Field */}
                <CustomerInfoField title="Username" value={username} />
                {/* <CustomerInfoField title="Date of birth" value={dob} /> */}
                <CustomerInfoField title="Country" value={country} />
                <CustomerInfoField title="Short Info" value={short_info} />

                {/* User's Posts Section */}
                <div>
                    <span>Posts</span>
                    <div>
                        {posts?.map((post: Post) => (
                            <div key={post.id}>
                                <ActionLink to={`/post/${post.id}`}>
                                    {(() => {
                                        try {
                                            const parsedContent = JSON.parse(
                                                post?.content
                                            )
                                            return (
                                                parsedContent[0]?.field_value ||
                                                'No content'
                                            )
                                        } catch (error) {
                                            console.error(
                                                'Error parsing post content:',
                                                error
                                            )
                                            return 'Invalid content'
                                        }
                                    })()}
                                </ActionLink>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User's Communities Section */}
                <div>
                    <span>Communities</span>
                    <div>
                        {communities?.map((community: Community) => (
                            <div key={community.id}>
                                <ActionLink
                                    to={`/community/${community.id}/details`}
                                >
                                    {community.name}
                                </ActionLink>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User's Badges Section */}
                <div>
                <span>Communiche Badges</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {Object.values(
                            badges
                                .filter((badge: BadgeType) => badge.is_owned)
                                .reduce((acc: { [key: string]: BadgeType }, badge: BadgeType) => {
                                    if (
                                        !acc[badge.name] ||
                                        (acc[badge.name].tier !== 'Gold' &&
                                            (badge.tier === 'Gold' ||
                                                (acc[badge.name].tier !== 'Silver' &&
                                                    badge.tier === 'Silver')))
                                    ) {
                                        acc[badge.name] = badge
                                    }
                                    return acc
                                }, {})
                        ).map((badge: BadgeType) => (
                            <div
                                key={badge.id}
                                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 border-white ${
                                    badge.tier === 'Gold'
                                        ? 'bg-yellow-300'
                                        : badge.tier === 'Silver'
                                        ? 'bg-gray-300'
                                        : badge.tier === 'Bronze'
                                        ? 'bg-yellow-600 bg-opacity-40'
                                        : 'bg-white-500'
                                }`}
                                title={`${badge.name} - ${badge.tier}`}
                            >
                                <img
                                    src={badge.icon}
                                    alt={`${badge.name} - ${badge.tier}`}
                                    className="w-6 h-6"
                                />
                            </div>
                        ))}
                    </div>
                    <br/>
                <span>Badges from Communities</span>
                </div>
            </div>
        </div>
    )
}
