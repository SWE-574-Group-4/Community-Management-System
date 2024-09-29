import { useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import ActionLink from '@/components/shared/ActionLink'
import { apiForgotPassword } from '@/services/AuthService'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import type { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'

interface ForgotPasswordFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type ForgotPasswordFormSchema = {
    email: string
}

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
    const { disableSubmit = false, className, signInUrl = '/login' } = props

    const [emailSent, setEmailSent] = useState(false)

    const [message, setMessage] = useTimeOutMessage()

    const { t } = useTranslation()

    const validationSchema = Yup.object().shape({
        email: Yup.string().required(
            t('signUp.errors.email') || 'Please enter your email'
        ),
    })

    const onSendMail = async (
        values: ForgotPasswordFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)
        try {
            const resp = await apiForgotPassword(values)
            if (resp.data) {
                setSubmitting(false)
                setEmailSent(true)
            }
        } catch (errors) {
            setMessage(
                (errors as AxiosError<{ message: string }>)?.response?.data
                    ?.message || (errors as Error).toString()
            )
            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <div className="mb-6">
                {emailSent ? (
                    <>
                        <h3 className="mb-1">
                            {t('forgotPassword.checkEmail')}
                        </h3>

                        <p>{t('forgotPassword.successMessage')}</p>
                    </>
                ) : (
                    <>
                        <h3 className="mb-1">{t('forgotPassword.title')}</h3>
                        <p>{t('forgotPassword.message')}</p>
                    </>
                )}
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    email: 'mehmeteyupoglu2@gmail.com',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSendMail(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className={emailSent ? 'hidden' : ''}>
                                <FormItem
                                    invalid={errors.email && touched.email}
                                    errorMessage={errors.email}
                                >
                                    <Field
                                        type="email"
                                        autoComplete="off"
                                        name="email"
                                        placeholder="Email"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {emailSent
                                    ? t('forgotPassword.resend')
                                    : t('forgotPassword.send')}
                            </Button>
                            <div className="mt-4 text-center">
                                <span>{t('forgotPassword.back')}</span>
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

export default ForgotPasswordForm
