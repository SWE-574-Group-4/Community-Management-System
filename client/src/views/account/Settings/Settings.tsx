import { useState, useEffect, Suspense } from 'react'
import Tabs from '@/components/ui/Tabs'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Profile from './components/Profile'
import { useAppSelector } from '@/store'
import Invitations from './components/Invitations'
import Communities from './components/Communities'

const { TabNav, TabList } = Tabs

const Settings = () => {
    const user = useAppSelector((state) => state.auth.user)
    const [currentTab, setCurrentTab] = useState('profile')
    const navigate = useNavigate()
    const location = useLocation()

    const onTabChange = (val: string) => {
        setCurrentTab(val)
        navigate(`/app/account/settings/${val}`)
    }

    useEffect(() => {
        const pathSegments = location.pathname.split('/')
        const lastPathSegment = pathSegments[pathSegments.length - 1]
        setCurrentTab(lastPathSegment)
    }, [location.pathname])

    const { t } = useTranslation()

    const settingsMenu: Record<
        string,
        {
            label: string
            path: string
        }
    > = {
        profile: { label: t('settings.profile.title'), path: 'profile' },
        invitations: { label: t('Invitations'), path: 'invitations' },
        myCommunities: { label: t('My Communities'), path: 'myCommunities' },
    }

    return (
        <Container>
            <AdaptableCard>
                <Tabs
                    value={currentTab}
                    variant="pill"
                    onChange={(val) => onTabChange(val)}
                >
                    <TabList className="pb-4">
                        {Object.keys(settingsMenu).map((key) => (
                            <TabNav key={key} value={key}>
                                {settingsMenu[key].label}
                            </TabNav>
                        ))}
                    </TabList>
                </Tabs>
                <div className="px-1 py-2 md:px-4 md:py-6">
                    <Suspense fallback={<></>}>
                        {currentTab === 'profile' && <Profile data={user} />}
                        {currentTab === 'invitations' && <Invitations />}
                        {currentTab === 'myCommunities' && <Communities />}
                    </Suspense>
                </div>
            </AdaptableCard>
        </Container>
    )
}

export default Settings
