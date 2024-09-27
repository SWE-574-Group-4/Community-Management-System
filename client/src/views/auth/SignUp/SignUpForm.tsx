import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import type { CommonProps } from '@/@types/common'
import { useTranslation } from 'react-i18next'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type SignUpFormSchema = {
    [key in
        | 'firstname'
        | 'lastname'
        | 'username'
        | 'password'
        | 'email'
        | 'dob'
        | 'country'
        | 'phone'
        | 'short_bio']: string
}

const SignUpForm = (props: SignUpFormProps) => {
    const { t } = useTranslation()

    const validationSchema = Yup.object().shape({
        firstname: Yup.string().required(
            t('signUp.errors.firstname') || 'Please enter your firstname'
        ),
        lastname: Yup.string().required(
            t('signUp.errors.lastname') || 'Please enter your lastname'
        ),
        username: Yup.string().required(
            t('signUp.errors.username') || 'Please enter your username'
        ),
        password: Yup.string().required(
            t('signUp.errors.password') || 'Please enter your password'
        ),
        email: Yup.string().email().nullable(),
        dob: Yup.string().nullable(),
        country: Yup.string().nullable(),
        phone: Yup.string().nullable(),
        short_bio: Yup.string().nullable(),
    })

    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

    const { signUp } = useAuth()

    const [message, setMessage] = useTimeOutMessage()

    const onSignUp = async (
        values: SignUpFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const {
            firstname,
            lastname,
            username,
            password,
            email,
            dob,
            country,
            phone,
            short_bio,
        } = values
        setSubmitting(true)
        const result = await signUp({
            firstname,
            lastname,
            username,
            password,
            email,
            dob,
            country,
            phone,
            short_bio,
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
        }

        setSubmitting(false)
    }

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <>{t(`codes.${message}`)}</>
                </Alert>
            )}
            <Formik
                initialValues={{
                    firstname: '',
                    lastname: '',
                    username: '',
                    password: '',
                    email: '',
                    dob: '',
                    country: '',
                    phone: '',
                    short_bio: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSignUp(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label={
                                    t('signUp.placeholders.firstname') ||
                                    'First Name'
                                }
                                invalid={errors.firstname && touched.firstname}
                                errorMessage={errors.firstname}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="firstname"
                                    placeholder={t(
                                        'signUp.placeholders.firstname'
                                    ).toLowerCase()}
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label={
                                    t('signUp.placeholders.lastname') ||
                                    'Last Name'
                                }
                                invalid={errors.lastname && touched.lastname}
                                errorMessage={errors.lastname}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="lastname"
                                    placeholder={t(
                                        'signUp.placeholders.lastname'
                                    ).toLowerCase()}
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label={
                                    t('signUp.placeholders.username') ||
                                    'Username'
                                }
                                invalid={errors.username && touched.username}
                                errorMessage={errors.username}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="username"
                                    placeholder={t(
                                        'signUp.placeholders.username'
                                    ).toLowerCase()}
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label={
                                    t('signUp.placeholders.password') ||
                                    'Password'
                                }
                                invalid={errors.password && touched.password}
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete="off"
                                    name="password"
                                    placeholder={t(
                                        'signUp.placeholders.password'
                                    ).toLowerCase()}
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <FormItem
                                label={
                                    t('signUp.placeholders.email') || 'Email'
                                }
                                invalid={errors.email && touched.email}
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="email"
                                    autoComplete="off"
                                    name="email"
                                    placeholder={t(
                                        'signUp.placeholders.email'
                                    ).toLowerCase()}
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label={
                                    t('signUp.placeholders.dob') ||
                                    'Date of Birth'
                                }
                                invalid={errors.dob && touched.dob}
                                errorMessage={errors.dob}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="dob"
                                    placeholder={t(
                                        'signUp.placeholders.dob'
                                    ).toLowerCase()}
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label={
                                    t('signUp.placeholders.country') ||
                                    'Country'
                                }
                                invalid={errors.country && touched.country}
                                errorMessage={errors.country}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="country"
                                    placeholder={t(
                                        'signUp.placeholders.country'
                                    ).toLowerCase()}
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label={
                                    t('signUp.placeholders.phone') ||
                                    'Phone Number'
                                }
                                invalid={errors.phone && touched.phone}
                                errorMessage={errors.phone}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="phone"
                                    placeholder={t(
                                        'signUp.placeholders.phone'
                                    ).toLowerCase()}
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label={
                                    t('signUp.placeholders.short_bio') ||
                                    'Short Bio'
                                }
                                invalid={errors.short_bio && touched.short_bio}
                                errorMessage={errors.short_bio}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="short_bio"
                                    placeholder={t(
                                        'signUp.placeholders.short_bio'
                                    ).toLowerCase()}
                                    component={Input}
                                />
                            </FormItem>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {isSubmitting
                                    ? t('signUp.createAccount')
                                    : t('signIn.signUp')}
                            </Button>
                            <div className="mt-4 text-center">
                                <span>{t('signUp.haveAccount')} </span>
                                <ActionLink to={signInUrl}>
                                    {t('signIn.signIn')}
                                </ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignUpForm
