import SignUpForm from './SignUpForm'
import { useTranslation } from 'react-i18next'

const SignUp = () => {
    const { t } = useTranslation()
    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">{t('signIn.signUp')}</h3>
                <p>{t('signUp.signUpMessage')}</p>
            </div>
            <SignUpForm disableSubmit={false} />
        </>
    )
}

export default SignUp
