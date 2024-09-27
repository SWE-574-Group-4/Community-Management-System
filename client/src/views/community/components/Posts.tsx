import { IndividualCommunityType, Member } from '@/@types/community'
import { Card } from '@/components/ui'
import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiGetCommunityPosts } from '@/services/PostService'
import PostsTable from './PostsTable'
import { PostData } from '@/@types/post'

export default function Posts() {
    const [posts, setPosts] = useState<PostData[]>([])
    const fetchTrigger = useAppSelector(
        (state) => state.community.community.fetchTrigger
    )

    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const posts = await apiGetCommunityPosts(String(id) ?? '')
                if (posts.status === 200) {
                    setPosts(posts.data as PostData[])
                }
                // fetch posts data
                console.log('fetching posts: ', posts)
            } catch (error) {
                console.error('Error fetching posts', error)
            }
        }

        fetchPosts()
    }, [fetchTrigger])

    return (
        <div className="mb-5">
            <Card
                clickable
                className="hover:shadow-lg transition duration-150 ease-in-out dark:border dark:border-gray-600 dark:border-solid"
                headerClass="p-0"
                footerBorder={false}
                headerBorder={false}
            >
                <PostsTable posts={posts} />
            </Card>
        </div>
    )
}
