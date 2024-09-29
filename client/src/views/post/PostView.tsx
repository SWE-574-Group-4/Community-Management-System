import { PostData } from '@/@types/post'
import { apiGetPost } from '@/services/PostService'
import { formatDate } from '@/utils/helpers'
import useFetchData from '@/utils/hooks/useFetchData'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import DisplayPost from './components/DisplayPost'
import { AxiosResponse } from 'axios'
import { useAppSelector } from '@/store'

export default function PostView() {
    const { id } = useParams<{ id: string }>()
    const userId = useAppSelector((state) => state.auth.user?.id)

    const post = useFetchData(apiGetPost, [id, userId]) as AxiosResponse
    return (
        <div>
            {post?.data && (
                <DisplayPost post={post.data as PostData} detailed />
            )}
        </div>
    )
}
