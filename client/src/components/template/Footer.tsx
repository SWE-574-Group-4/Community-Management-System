import classNames from 'classnames'
import Container from '@/components/shared/Container'
import { PAGE_CONTAINER_GUTTER_X } from '@/constants/theme.constant'
import Copyright from '../shared/Copyright'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export type FooterPageContainerType = 'gutterless' | 'contained'

type FooterProps = {
    pageContainerType: FooterPageContainerType
}

const FooterContent = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()  // Use navigate hook for programmatic navigation

    const handleNavigate = (path: string) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        navigate(path)  // Navigate to the specific path
    }

    return (
        <div className="flex items-center justify-between flex-auto w-full">
            <Copyright />
            <div className="hidden md:block">
                <a
                    className="text-gray"
                    href="/#"
                    onClick={handleNavigate('/terms-and-conditions')}  // Navigate to Terms and Conditions
                >
                    {t('application.terms_conditions')}
                </a>
                <span className="mx-2 text-muted"> | </span>
                <a
                    className="text-gray"
                    href="/#"
                    onClick={handleNavigate('/privacy-policy')}  // Navigate to Privacy Policy
                >
                    {t('application.privacy_policy')}
                </a>
            </div>
        </div>
    )
}

export default function Footer({ 
    pageContainerType = 'contained',
}: FooterProps) {
    return (
        <footer
            className={classNames(
                `footer flex flex-auto items-center h-16 ${PAGE_CONTAINER_GUTTER_X}`
            )}
        >
            {pageContainerType === 'contained' ? (
                <Container>
                    <FooterContent />
                </Container>
            ) : (
                <FooterContent />
            )}
        </footer>
    )
}
