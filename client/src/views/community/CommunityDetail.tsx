import { useState, useEffect, Suspense } from 'react'
import Tabs from '@/components/ui/Tabs'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { IndividualCommunityType } from '@/@types/community'
import { apiGetCommunity, apiGetUserRole } from '@/services/CommunityService'
import { Button, Notification, Tag, toast } from '@/components/ui'
import CommunityDetail from './components/CommunityDetail'
import Members from './components/Members'
import { AuthorityCheck } from '@/components/shared'
import useFetchData from '@/utils/hooks/useFetchData'
import { mapRoleToLabel } from '@/utils/helpers'
import PendingRequests from './components/PendingRequests'
import Invite from './Invite'
import Posts from './components/Posts'
import Reports from './components/Reports'
import CreateCommunityBadges from './components/CreateCommunityBadges'
import CommunitySpecificTemplates from './components/CommunitySpecificTemplates'
import { HiOutlineDocumentAdd } from 'react-icons/hi'
import { rule } from 'postcss'
import CommunityBadges from './components/CommunityBadges'

const { TabNav, TabList } = Tabs

const Settings = () => {
    const [community, setCommunity] = useState<IndividualCommunityType>(
        {} as IndividualCommunityType
    )
    const [currentTab, setCurrentTab] = useState('posts')
    const navigate = useNavigate()
    const location = useLocation()

    const [mappedRole, setMappedRole] = useState<string>('')
    const { id } = useParams<{ id: string }>()
    const userId = useAppSelector((state) => state.auth.user?.id)
    const fetchTrigger = useAppSelector(
        (state) => state.community.community.fetchTrigger
    )

    const onTabChange = (val: string) => {
        console.log({ val })
        setCurrentTab(val)
        navigate(`/community/${id}/${val}`)
    }

    const userRole = useFetchData(apiGetUserRole, [id, userId])

    useEffect(() => {
        if (userRole) {
            setMappedRole(mapRoleToLabel((userRole as any)?.data?.role))
        }
    }, [userRole])

    const communityDetailsMenu: Record<
        string,
        {
            label: string
            path: string
            authority?: string[]
        }
    > = {
        posts: {
            label: 'Posts',
            path: 'posts',
        },
        details: { label: 'Details', path: 'details' },
        rules: { label: 'Rules', path: 'rules' },
        members: { label: 'Members', path: 'members' },

        details: { 
            label: 'Details', 
            path: 'details' 
        },
        members: { 
            label: 'Members', 
            path: 'members' 
        },
        badges: { 
            label: 'Badges', 
            path: 'CommunityBadges' 
        },
        requests: {
            label: 'Requests',
            path: 'requests',
            authority: ['owner', 'moderator'],
        },
        invite: {
            label: 'Invite',
            path: 'invite',
            authority: ['owner', 'moderator'],
        },
        templates: {
            label: 'Templates',
            path: 'templates',
            authority: ['owner', 'moderator'],
        },
        reports: {
            label: 'Reports',
            path: 'reports',
            authority: ['owner', 'moderator'],
        },
        createBadges: {
            label: 'Create Badge',
            path: 'createCommunityBadges',
            authority: ['owner', 'moderator'],
        },
    }

    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                // fetch community data
                const resp = await apiGetCommunity(id ?? '', userId ?? '')

                if (resp.status === 200) {
                    setCommunity(resp.data as IndividualCommunityType)
                } else if (resp.status === 404) {
                    // community not found
                    navigate('/home')
                }
            } catch (error) {
                console.error('Error fetching community:', error)

                if ((error as any).response?.status === 404) {
                    navigate('/home')
                }

                toast.push(
                    <Notification
                        title={'Error fetching community'}
                        type="danger"
                    />,
                    {
                        placement: 'top-center',
                    }
                )
            }
        }
        fetchCommunity()
    }, [id, fetchTrigger])

    return (
        <Container>
            <AdaptableCard>
                <Tag className="text-white bg-emerald-600 border-0 mb-5">
                    Name: {community?.name || 'Community'}
                </Tag>

                {mappedRole && (
                    <Tabs
                        value={currentTab}
                        variant="pill"
                        onChange={(val) => onTabChange(val)}
                    >
                        <TabList className="pb-2">
                            {Object.keys(communityDetailsMenu).map((key) => (
                                <AuthorityCheck
                                    key={key}
                                    authority={[mappedRole]}
                                    userAuthority={
                                        communityDetailsMenu[key].authority ||
                                        []
                                    }
                                >
                                    <TabNav value={key}>
                                        {communityDetailsMenu[key].label}
                                    </TabNav>
                                </AuthorityCheck>
                            ))}
                        </TabList>
                    </Tabs>
                )}
                <div className="py-4">
                    
                    <Suspense fallback={<></>}>
                    {currentTab === 'posts' && (
                        <>
                        <Button
                            disabled={!community.is_member}
                            className="mb-3 flex items-center justify-center gap-x-0.5"
                            size="sm"
                            variant="twoTone"
                            color="emerald-600"
                            block
                            onClick={() =>
                                navigate(`/community/${id}/post`, {
                                    state: { community },
                                })
                            }
                        >
                            <HiOutlineDocumentAdd className="" />
                            <span>Post</span>
                        </Button>
                        <Posts />
                            
                        </>
                    )}
                        {currentTab === 'details' && (
                            <CommunityDetail community={community} />
                        )}
                        {currentTab === 'members' && (
                            <Members community={community} />
                        )}

                        {currentTab === 'requests' && (
                            <PendingRequests community={community} />
                        )}
                        {currentTab === 'invite' && <Invite />}
                        {currentTab === 'templates' && (
                            <CommunitySpecificTemplates />
                        )}
                        {currentTab === 'reports' && <Reports />}
                        {currentTab === 'rules' && (
                            <div>
                                {community.rules ? (
                                    <ul>
                                        {community.rules.split('\n').map((rule, index) => (
                                            <li key={index}>{rule}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <h1>No Community Rules Available</h1>
                                )}
                            </div>
                        )}
                        {currentTab === 'badges' && <CommunityBadges />}

                        {currentTab === 'createBadges' && <CreateCommunityBadges />}
                    </Suspense>
                </div>
            </AdaptableCard>
        </Container>
    )
}

export default Settings
