import useFetchData from '@/utils/hooks/useFetchData'
import RecentCommunities from './community/components/RecentCommunities'
import DisplayPost from './post/components/DisplayPost'
import { apiGetPosts } from '@/services/PostService'
import { useAppSelector } from '@/store'
import { AxiosResponse } from 'axios'

const Home = () => {
    const userId = useAppSelector((state) => state.auth.user?.id)
    const data = useFetchData(apiGetPosts, [userId]) as AxiosResponse
    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="lg:col-span-9 md:col-span-8 sm:col-span-12 col-span-12">
                <h3>Hot Topics</h3>
                {(data?.data as any[])?.map((post: any) =>
                    post.community.is_public || post.community.is_member ? (
                        <DisplayPost key={post.id} post={post} />
                    ) : null
                )}
            </div>
            <div className="lg:col-span-3 md:col-span-4 sm:col-span-12 col-span-12">
                <RecentCommunities />
            </div>
        </div>
    )
}

export default Home
