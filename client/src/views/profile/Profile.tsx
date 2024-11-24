import { Community, Post } from '@/@types/user'
import { ActionLink } from '@/components/shared'
import FollowButton from '@/views/profile/FollowButton'
import { apiGetUserInformation, isFollowing } from '@/services/UserService'
import { useAppSelector } from '@/store'
import useFetchData from '@/utils/hooks/useFetchData'
import { AxiosResponse } from 'axios'
import { useParams } from 'react-router-dom'

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
            </div>
        </div>
    )
}
