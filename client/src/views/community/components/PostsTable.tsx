// src/views/community/components/PostsTable.tsx
import { useState } from 'react'
import { apiAcceptRejectRequest } from '@/services/CommunityService'
import { toggleFetchTrigger } from '@/store'
import useRequestWithNotification from '@/utils/hooks/useRequestWithNotification'
import { useDispatch } from 'react-redux'
import { PostData } from '@/@types/post'
import { useNavigate } from 'react-router-dom'
import DisplayPost from '../../post/components/DisplayPost' // Ensure the import path is correct

const PostsTable = ({ posts }: { posts: PostData[] }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [handleAcceptReject, isHandleAccepRejecting] =
        useRequestWithNotification(
            apiAcceptRejectRequest,
            'Action taken successfully',
            'Error taking action',
            () => dispatch(toggleFetchTrigger())
        )

    return (
        <div>
            {posts.map((post) => (
                <DisplayPost
                    key={post.id}
                    post={post}
                    detailed={false} // Adjust as needed
                    showCommunityName={false} // Hide the community name
                />
            ))}
        </div>
    )
}

export default PostsTable
