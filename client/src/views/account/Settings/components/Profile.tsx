import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormContainer } from '@/components/ui/Form'
import FormDesription from './FormDesription'
import FormRow from './FormRow'
import { Field, Form, Formik } from 'formik'
import {
    HiOutlineUserCircle,
    HiOutlineMail,
    HiOutlineUser,
    HiCheck,
    HiOutlineMap,
    HiOutlineAcademicCap,
} from 'react-icons/hi'
import * as Yup from 'yup'
import type { OptionProps } from 'react-select'
import type { FormikProps, FieldInputProps, FieldProps } from 'formik'
import { useTranslation } from 'react-i18next'
import { deleteUser, updateProfile } from '@/services/UserService'
import { UserResponseType } from '@/@types/user'
import { useDispatch } from 'react-redux'
import { setUser, toggleFetchTrigger } from '@/store'
import useRequestWithNotification from '@/utils/hooks/useRequestWithNotification'
import useAuth from '@/utils/hooks/useAuth'

type ProfileProps = {
    data?: UserResponseType
}

// TODO: translation needed
const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username Required'),
    firstname: Yup.string()
        .min(3, 'Too Short!')
        .max(12, 'Too Long!')
        .required('First Name Required'),
    lastname: Yup.string()
        .min(3, 'Too Short!')
        .max(12, 'Too Long!')
        .required('Last Name Required'),
    email: Yup.string().email('Invalid email').required('Email Required'),
    gender: Yup.string(),
})

type GenderOption = {
    value: string
    label: string
}

const CustomSelectOption = ({
    innerProps,
    label,
    isSelected,
}: OptionProps<GenderOption>) => {
    return (
        <div
            className={`flex items-center justify-between p-2 ${
                isSelected
                    ? 'bg-gray-100 dark:bg-gray-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
            {...innerProps}
        >
            <div className="flex items-center">
                <span className="ml-2 rtl:mr-2">{label}</span>
            </div>
            {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
        </div>
    )
}

const Profile = ({
    data = {
        id: -1,
        country: '',
        dob: '',
        email: '',
        firstname: '',
        lastname: '',
        phone: '',
        short_bio: '',
        username: '',
    },
}: ProfileProps) => {
    const { t } = useTranslation()
    const { signOut } = useAuth()

    const dispatch = useDispatch()
    const onSetFormFile = (
        form: FormikProps<UserResponseType>,
        field: FieldInputProps<UserResponseType>,
        file: File[]
    ) => {
        form.setFieldValue(field.name, URL.createObjectURL(file[0]))
    }

    const onFormSubmit = async (
        values: UserResponseType,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        try {
            const resp = await updateProfile(values)
            console.log('resp', resp)

            if (resp.data) {
                dispatch(setUser(resp.data as UserResponseType))
                // TODO: add english i18n version
                toast.push(
                    <Notification
                        title={
                            t('settings.profile.updateMessage.success') ||
                            'Update successful'
                        }
                        type="success"
                    />,
                    {
                        placement: 'top-center',
                    }
                )
            }
        } catch (error) {
            console.log('error', error)
            toast.push(
                <Notification
                    title={
                        t('settings.profile.updateMessage.error') ||
                        'Update not successful'
                    }
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

    const genderOptions: GenderOption[] = [
        { value: 'male', label: t(`settings.profile.genders.Male`) },
        { value: 'female', label: t(`settings.profile.genders.Female`) },
        { value: 'other', label: t(`settings.profile.genders.Other`) },
    ]

    const [handleDelete, isDeleting] = useRequestWithNotification(
        deleteUser,
        'You have left the community!',
        'Error leaving the community',
        () => postAction()
    )

    const postAction = () => {
        dispatch(toggleFetchTrigger())
        signOut()
    }

    return (
        <Formik
            enableReinitialize
            initialValues={data}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                onFormSubmit(values, setSubmitting)
            }}
        >
            {({ values, touched, errors, isSubmitting, resetForm }) => {
                const validatorProps = { touched, errors }
                return (
                    <Form>
                        <FormContainer>
                            <FormDesription
                                title={t('settings.title')}
                                desc={t('settings.description')}
                            />
                            <FormRow
                                name="username"
                                label={t('application.user.username')}
                                {...validatorProps}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="username"
                                    placeholder={t('application.user.username')}
                                    component={Input}
                                    prefix={
                                        <HiOutlineUserCircle className="text-xl" />
                                    }
                                />
                            </FormRow>
                            <FormRow
                                name="firstname"
                                label={t('application.user.firstName')}
                                {...validatorProps}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="firstname"
                                    placeholder={t(
                                        'application.user.firstName'
                                    )}
                                    component={Input}
                                    prefix={
                                        <HiOutlineUserCircle className="text-xl" />
                                    }
                                />
                            </FormRow>
                            <FormRow
                                name="lastname"
                                label={t('application.user.lastName')}
                                {...validatorProps}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="lastname"
                                    placeholder={t('application.user.lastName')}
                                    component={Input}
                                    prefix={
                                        <HiOutlineUserCircle className="text-xl" />
                                    }
                                />
                            </FormRow>
                            <FormRow
                                name="email"
                                label={t('application.user.email')}
                                {...validatorProps}
                            >
                                <Field
                                    type="email"
                                    autoComplete="off"
                                    name="email"
                                    placeholder={t('application.user.email')}
                                    component={Input}
                                    prefix={
                                        <HiOutlineMail className="text-xl" />
                                    }
                                />
                            </FormRow>
                            <FormRow
                                name="dob"
                                label={t('Date of Birth')}
                                {...validatorProps}
                            >
                                <Field
                                    autoComplete="off"
                                    name="dob"
                                    type="date"
                                    placeholder={t('Date of Birth')}
                                    component={Input}
                                    prefix={
                                        <HiOutlineUser className="text-xl" />
                                    }
                                />
                            </FormRow>
                            <FormRow
                                name="country"
                                label={t('Country')}
                                {...validatorProps}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="country"
                                    placeholder={t('Country')}
                                    component={Input}
                                    prefix={
                                        <HiOutlineMap className="text-xl" />
                                    }
                                />
                            </FormRow>
                            <FormRow
                                name="short_bio"
                                label={t('Short Bio')}
                                {...validatorProps}
                            >
                                <Field
                                    type="text"
                                    textArea
                                    autoComplete="off"
                                    name="short_bio"
                                    placeholder={t('Short Bio')}
                                    component={Input}
                                    prefix={
                                        <HiOutlineAcademicCap className="text-xl" />
                                    }
                                />
                            </FormRow>
                            <div className="mt-4 ltr:text-right">
                                <Button
                                    className="ltr:mr-2 rtl:ml-2"
                                    type="button"
                                    onClick={() =>
                                        typeof handleDelete === 'function' &&
                                        handleDelete(data.id)
                                    }
                                >
                                    {t('Delete Account')}
                                </Button>
                                <Button
                                    variant="solid"
                                    loading={isSubmitting}
                                    type="submit"
                                >
                                    {isSubmitting
                                        ? t('settings.profile.buttons.updating')
                                        : t('settings.profile.buttons.update')}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default Profile
