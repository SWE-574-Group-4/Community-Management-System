import useFetchData from '@/utils/hooks/useFetchData'
import RecentCommunities from './community/components/RecentCommunities'
import DisplayPost from './post/components/DisplayPost'
import { apiGetPosts } from '@/services/PostService'

const Home = () => {
    const data = useFetchData(apiGetPosts, [])
    return (
        <div className="flex gap-5">
            <div className="grow">
                <h3>Hot Topics</h3>
                {(data?.data as any[])?.map((post: any) => (
                    <DisplayPost key={post.id} post={post} />
                ))}
            </div>
            <RecentCommunities />
        </div>
    )
}

export default Home
