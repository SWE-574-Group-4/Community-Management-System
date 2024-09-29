import { APP_NAME } from '@/constants/app.constant'
import { useTranslation } from 'react-i18next'

const Copyright = () => {
    const { t } = useTranslation()
    return (
        <span className="text-white">
            &copy;
            {t('footer.copyright', {
                year: `${new Date().getFullYear()}`,
            })}{' '}
            <span className="font-semibold">{`${APP_NAME}`}</span>{' '}
        </span>
    )
}

export default Copyright
