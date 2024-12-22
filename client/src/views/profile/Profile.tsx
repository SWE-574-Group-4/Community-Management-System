import { Community, CommunityBadgeType, Post } from '@/@types/user'
import { ActionLink } from '@/components/shared'
import FollowButton from '@/views/profile/FollowButton'
import { apiGetUserInformation, isFollowing } from '@/services/UserService'
import { useAppSelector } from '@/store'
import useFetchData from '@/utils/hooks/useFetchData'
import { AxiosResponse } from 'axios'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { apiGetBadges } from '@/services/UserService'
import { apiGetAllUserCommunityBadges } from '@/services/CommunityService'
import { BadgeType } from '@/@types/user'

type CustomerInfoFieldProps = {
    title?: string
    value?: string
}

const badgeIcons = [
    { value: 'trophy', label: '🏆' },
    { value: 'medal', label: '🥇' },
    { value: 'certificate', label: '📜' },
    { value: 'star', label: '⭐' },
    { value: 'shield-alt', label: '🛡️' },
    { value: 'award', label: '🏅' },
    { value: 'crown', label: '👑' },
    { value: 'ribbon', label: '🎗️' },
    { value: 'gem', label: '💎' },
    { value: 'badge', label: '🔖' },
    { value: 'rocket', label: '🚀' },
    { value: 'lightbulb', label: '💡' },
    { value: 'heart', label: '❤️' },
    { value: 'thumbs-up', label: '👍' },
    { value: 'handshake', label: '🤝' },
    { value: 'globe', label: '🌐' },
    { value: 'user', label: '👤' },
    { value: 'check-circle', label: '✅' },
    { value: 'flag', label: '🚩' },
    { value: 'leaf', label: '🍃' },
    { value: 'music', label: '🎵' },
    { value: 'smile', label: '😊' },
    { value: 'tree', label: '🌳' },
    { value: 'plane', label: '✈️' },
    { value: 'fire', label: '🔥' },
    { value: 'sun', label: '☀️' },
    { value: 'cloud', label: '☁️' },
    { value: 'rainbow', label: '🌈' },
    { value: 'anchor', label: '⚓' },
    { value: 'lock', label: '🔒' },
    { value: 'unlock', label: '🔓' },
    { value: 'clock', label: '⏰' },
    { value: 'bell', label: '🔔' },
    { value: 'pencil', label: '✏️' },
    { value: 'book', label: '📚' },
    { value: 'camera', label: '📷' },
    { value: 'tools', label: '🛠' },
    { value: 'suitcase', label: '💼' },
    { value: 'car', label: '🚗' },
    { value: 'bicycle', label: '🚲' },
    { value: 'puzzle-piece', label: '🧩' },
    { value: 'microphone', label: '🎤' },
    { value: 'telescope', label: '🔭' },
    { value: 'umbrella', label: '☂️' },
    { value: 'key', label: '🔑' },
    { value: 'diamond', label: '♦️' },
    { value: 'fish', label: '🐟' },
    { value: 'apple', label: '🍎' },
    { value: 'banana', label: '🍌' },
    { value: 'dog', label: '🐶' },
    { value: 'cat', label: '🐱' },
    { value: 'horse', label: '🐴' },
    { value: 'lion', label: '🦁' },
    { value: 'elephant', label: '🐘' },
    { value: 'dragon', label: '🐉' },
    { value: 'unicorn', label: '🦄' },
    { value: 'ghost', label: '👻' },
    { value: 'alien', label: '👽' },
    { value: 'robot', label: '🤖' },
    { value: 'cake', label: '🎂' },
    { value: 'pizza', label: '🍕' },
    { value: 'hamburger', label: '🍔' },
    { value: 'sushi', label: '🍣' },
    { value: 'icecream', label: '🍦' },
    { value: 'coffee', label: '☕' },
    { value: 'beer', label: '🍺' },
    { value: 'wine-glass', label: '🍷' },
    { value: 'champagne', label: '🍾' },
    { value: 'cheese', label: '🧀' },
    { value: 'donut', label: '🍩' },
    { value: 'cookie', label: '🍪' },
    { value: 'popcorn', label: '🍿' },
];

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

    const [communityBadges, setCommunityBadges] = useState<CommunityBadgeType[]>([])

    useEffect(() => {
        const fetchCommunityBadges = async () => {
            try {
                const response = await apiGetAllUserCommunityBadges(String(userId) ?? '');
                const formattedBadges = (response.data as any[]).map((badge: any) => ({
                    id: badge.id,
                    name: badge.name,
                    icon: badge.icon,  // Emoji icon
                    backgroundColor: badge.background_color || '#ffffff',
                    criteria: badge.criteria,
                    is_owned: badge.is_owned,
                    status: true, // Assuming status is true for all badges
                }));
                console.log('Formatted Community Badges:', formattedBadges);
                setCommunityBadges(formattedBadges as BadgeType[]);
            } catch (error) {
                console.error('Error fetching community badges:', error);
            }
        };
    
        if (userId) {
            fetchCommunityBadges();
        }
    }, [userId]);
    

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
                                className={`w-12 h-12 flex items-center justify-center rounded-full border-2 border-white ${
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
                                    className="w-9 h-9"
                                />
                            </div>
                        ))}
                    </div>
                    <br/>
                    {/* Badges from Communities */}
                    {communityBadges.some((badge) => 
                        badge.is_owned && typeof badge.criteria === 'object' && !('selected_user' in badge.criteria)
                    ) && (
                        <>
                            <span>Badges from Communities</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {communityBadges
                                    .filter((badge) => 
                                        badge.is_owned && typeof badge.criteria === 'object' && !('selected_user' in badge.criteria)
                                    )
                                    .map((badge: BadgeType) => {
                                        const badgeEmoji =
                                            badgeIcons.find((icon) => icon.value === badge.icon)?.label || '🏆';

                                        return (
                                            <div
                                                key={badge.id}
                                                className={`w-12 h-12 flex items-center justify-center text-2xl font-bold rounded-full border-2 border-white`}
                                                style={{
                                                    backgroundColor: badge.backgroundColor,
                                                }}
                                                title={badge.name}
                                            >
                                                {badgeEmoji}
                                            </div>
                                        );
                                    })}
                            </div>
                        </>
                    )}

                    {/* Special Rewards Section */}
                    {communityBadges.some((badge) => 
                        badge.is_owned && typeof badge.criteria === 'object' && 'selected_user' in badge.criteria
                    ) && (
                        <>
                            <br/>
                            <span><b>⭐ Special Rewards ⭐</b></span>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {communityBadges
                                    .filter((badge) => 
                                        badge.is_owned && typeof badge.criteria === 'object' && 'selected_user' in badge.criteria
                                    )
                                    .map((badge: BadgeType) => {
                                        const badgeEmoji =
                                            badgeIcons.find((icon) => icon.value === badge.icon)?.label || '🏆';

                                        return (
                                            <div
                                                key={badge.id}
                                                className={`w-12 h-12 flex items-center justify-center text-2xl font-bold rounded-full border-2 border-white`}
                                                style={{
                                                    backgroundColor: badge.backgroundColor,
                                                }}
                                                title={badge.name}
                                            >
                                                {badgeEmoji}
                                            </div>
                                        );
                                    })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
