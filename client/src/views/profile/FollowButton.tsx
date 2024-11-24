import { useState } from 'react'
import Button from '@/components/ui/Button'
import { followUser, unfollowUser } from '@/services/UserService'
import { set } from 'lodash'

type FollowButtonProps = {
    userId: number
    authUserId: number
    isFollowed: boolean
}

const FollowButton = ({
    userId,
    authUserId,
    isFollowed,
}: FollowButtonProps) => {
    const [isFollowing, setIsFollowing] = useState(isFollowed)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleFollowToggle = async () => {
        setLoading(true)
        setError(null)
        try {
            if (isFollowing) {
                await unfollowUser(userId, authUserId)
                setError('User is unfollowed successfully')
            } else {
                await followUser(userId, authUserId)
                setError('User is followed successfully')
            }
            setIsFollowing(!isFollowing)
        } catch (error) {
            console.error('Error following/unfollowing user:', error)
            setError('An error occurred. Please try again.')
            setIsFollowing(isFollowed)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Button
                variant={isFollowing ? 'solid' : 'default'}
                loading={loading}
                onClick={handleFollowToggle}
            >
                {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
            {error && (
                <p style={{ color: 'green', marginTop: '10px' }}>{error}</p>
            )}
        </div>
    )
}

export default FollowButton
