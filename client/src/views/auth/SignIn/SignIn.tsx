import SignInForm from './SignInForm'
import { useTranslation } from 'react-i18next'

const SignIn = () => {
    const { t } = useTranslation()

    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">{t('signIn.welcomeMessage')}</h3>
                <p>{t('signIn.credentials')}</p>
            </div>
            <SignInForm disableSubmit={false} />
        </>
    )
}

export default SignIn
