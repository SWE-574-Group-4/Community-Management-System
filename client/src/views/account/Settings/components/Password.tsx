import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormContainer } from '@/components/ui/Form'
import FormDesription from './FormDesription'
import FormRow from './FormRow'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { updatePassword } from '@/services/UserService'
import { useAppSelector } from '@/store'

type PasswordFormModel = {
    newPassword: string
    confirmNewPassword: string
}

const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
        .required('Yeni şifrenizi girin')
        .min(8, 'Çok Kısa!')
        .matches(/^[A-Za-z0-9_-]*$/, 'Sadece Harf ve Rakamlar İzin Verilir'),
    confirmNewPassword: Yup.string().oneOf(
        [Yup.ref('newPassword'), ''],
        'Şifre uyuşmuyor'
    ),
})

const Password = () => {
    const user = useAppSelector((state) => state.auth.user)
    const onFormSubmit = async (
        values: PasswordFormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { newPassword } = values
        try {
            const res = await updatePassword({ userId: user.id, newPassword })
            console.log('res', res)
            toast.push(
                <Notification title={'Şifre Güncellendi'} type="success" />,
                {
                    placement: 'top-center',
                }
            )
        } catch (error) {
            console.log('error', error)
            toast.push(
                <Notification
                    title={'Şifre Güncelleme Başarısız'}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <Formik
                initialValues={{
                    newPassword: '',
                    confirmNewPassword: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    onFormSubmit(values, setSubmitting)
                }}
            >
                {({ touched, errors, isSubmitting, resetForm }) => {
                    const validatorProps = { touched, errors }
                    return (
                        <Form>
                            <FormContainer>
                                <FormDesription
                                    title="Şifre"
                                    desc="Gerekli bilgileri girerek şifreni yenileyebilirsin"
                                />
                                <FormRow
                                    name="newPassword"
                                    label="Yeni Şifre"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="newPassword"
                                        placeholder="Yeni Şifre"
                                        component={Input}
                                    />
                                </FormRow>
                                <FormRow
                                    name="confirmNewPassword"
                                    label="Şifre Onay"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="confirmNewPassword"
                                        placeholder="Şifre Onay"
                                        component={Input}
                                    />
                                </FormRow>
                                <div className="mt-4 ltr:text-right">
                                    <Button
                                        className="ltr:mr-2 rtl:ml-2"
                                        type="button"
                                        onClick={() => resetForm()}
                                    >
                                        Sıfırla
                                    </Button>
                                    <Button
                                        variant="solid"
                                        loading={isSubmitting}
                                        type="submit"
                                    >
                                        {isSubmitting
                                            ? 'Güncelleniyor'
                                            : 'Güncelle'}
                                    </Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </>
    )
}

export default Password
