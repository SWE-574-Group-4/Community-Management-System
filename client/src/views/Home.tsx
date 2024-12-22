import useFetchData from '@/utils/hooks/useFetchData'
import RecentCommunities from './community/components/RecentCommunities'
import DisplayPost from './post/components/DisplayPost'
import { apiGetPosts } from '@/services/PostService'
import { setUser, useAppSelector } from '@/store'
import { AxiosResponse } from 'axios'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { getInterests, getUserRecommendations, getUserRecommendedCommunities } from '@/services/UserService'

const Home = () => {
    const userId = useAppSelector((state) => state.auth.user?.id)
    const data = useFetchData(apiGetPosts, [userId]) as AxiosResponse

    // State for user's followed communities
    const [userCommunities, setUserCommunities] = useState<number[]>([])

    // State for recommended posts and communities
    const [recommendedData, setRecommendedData] = useState<any>({ recommended_posts: [], recommended_communities: [] })

    // Fetch user's followed communities
    // useEffect(() => {
    //     const fetchUserCommunities = async () => {
    //         if (userId) {
    //             try {
    //                 const response = await axios.get(`http://localhost:8000/user/communities/`, {
    //                     params: { user_id: userId },
    //                 })
    //                 const communityIds = response.data.map((community: any) => community.id)
    //                 setUserCommunities(communityIds)
    //             } catch (error) {
    //                 console.error('Error fetching user communities:', error)
    //             }
    //         }
    //     }
        
    //     fetchUserCommunities()
    // }, [userId])
    
    //Fetch recommended posts and communities
    // useEffect(() => {
    //     const fetchRecommendations = async () => {
    //         if (userId) {
    //             try {
    //                 const response = await axios.post('http://localhost:8000/api/recommendations/', { user_id: userId })
    //                 setRecommendedData(response.data)
    //             } catch (error) {
    //                 console.error('Error fetching recommendations:', error)
    //             }
    //         }
    //     }
    //     fetchRecommendations()
    // }, [userId])

    useEffect(() => {
        const fetchRecommendedCommunities = async () => {
            if (!userId) return;
            try {
                const userRecommendedCommunities:any = await getUserRecommendedCommunities(userId);
                setUserCommunities(userRecommendedCommunities);
            } catch (error) {
                console.error('Error fetching user recommendations:', error);
            }
        };

        fetchRecommendedCommunities();
    },[userId])

    useEffect(() => {
        // Fetch existing interests on load
        const fetchUserRecommendations = async () => {
            if (!userId) return;
            try {
                const userRecommendations = await getUserRecommendations(userId);
                setRecommendedData(userRecommendations);
            } catch (error) {
                console.error('Error fetching user recommendations:', error);
            }
        };

        fetchUserRecommendations();
    },[userId])


    // Filter posts by user's followed communities
    const filteredPosts = (data?.data as any[])?.filter((post: any) =>
        userCommunities.find((u:any) => u.id === post.community.id)
    )

    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="lg:col-span-9 md:col-span-8 sm:col-span-12 col-span-12">
                <h3>Feed</h3>

                {filteredPosts?.map((post: any) => (
                    <DisplayPost key={post.id} post={post} />
                ))}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-3 md:col-span-4 sm:col-span-12 col-span-12">
                <RecentCommunities />

                {/* Recommended Communities */}
                <div className="mt-6 bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-bold mb-4">Recommended Communities</h3>
                    {recommendedData.recommended_communities.length ? (
                        <ul>
                            {recommendedData.recommended_communities.map((community: any) => (
                                <li key={community.id} className="mb-2">
                                    <a
                                        href={`/community/${community.id}/details`}
                                        className="block border p-2 rounded hover:shadow"
                                    >
                                        <h4 className="font-bold">{community.name}</h4>
                                        <p>{community.description}</p>
                                        <small>{community.number_of_posts} posts</small>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No recommended communities available.</p>
                    )}
                </div>

                {/* Recommended Posts */}
                <div className="mt-6 bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-bold mb-4">Recommended Posts</h3>
                    {recommendedData.recommended_posts.length ? (
                        recommendedData.recommended_posts.map((post: any) => {
                            // Parse the `content` field
                            const parsedContent = JSON.parse(post.content)
                            const titleField = parsedContent.find((field: any) => field.field_name === 'title')

                            return (
                                <a
                                    key={post.id}
                                    href={`/post/${post.id}`}
                                    className="block border p-2 rounded mb-2 hover:shadow"
                                >
                                    <h4 className="font-bold">{titleField ? titleField.field_value : 'Untitled'}</h4>
                                </a>
                            )
                        })
                    ) : (
                        <p>No recommended posts available.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home
