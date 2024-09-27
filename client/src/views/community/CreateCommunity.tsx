import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Switcher from '@/components/ui/Switcher'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormContainer } from '@/components/ui/Form'
import FormDesription from '../account/Settings/components/FormDesription'
import FormRow from '../account/Settings/components/FormRow'
import { Field, Form, Formik } from 'formik'
import { HiOutlineBriefcase } from 'react-icons/hi'
import * as Yup from 'yup'
import { useNavigate, useParams } from 'react-router-dom'
import { CommunityFormModel } from '@/@types/community'
import {
    apiAddCommunity,
    apiUpdateCommunity,
} from '@/services/CommunityService'
import { t } from 'i18next'
import CommunitySpecificTemplates from './components/CommunitySpecificTemplates'
import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
import { useFetchCommunity } from '@/utils/hooks/useFetchCommunity'

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, 'Too Short!')
        .max(200, 'Too Long!')
        .required('Community Name Required'),
    description: Yup.string(),
    avatar: Yup.string(),
    isPublic: Yup.boolean(),
})

const CreateCommunity = () => {
    const [data, setData] = useState<CommunityFormModel>({
        name: '',
        description: '',
        is_public: false,
    })
    const cid = useParams<{ id: string }>().id
    const [editMode, setEditMode] = useState(false)
    const navigate = useNavigate()
    const userId = useAppSelector((state) => state.auth.user?.id)
    const fetchTrigger = useAppSelector(
        (state) => state.community.community.fetchTrigger
    )

    const community = cid ? useFetchCommunity(cid, fetchTrigger) : null

    useEffect(() => {
        if (community) {
            console.log('community', community)

            const { name, description, is_public } = community
            setData({
                name,
                description,
                is_public,
            })
        }
    }, [community])

    const onFormSubmit = async (
        values: CommunityFormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        try {
            const resp = await apiAddCommunity({
                ...values,
                userId,
            })

            if (resp.status == 201) {
                // TODO: add english i18n version
                toast.push(
                    <Notification
                        title={
                            t('community.messages.success') ||
                            'Addition successful'
                        }
                        type="success"
                    />,
                    {
                        placement: 'top-center',
                    }
                )

                setSubmitting(false)
                navigate('/communities')
            }
        } catch (error) {
            console.log('error', error)
            toast.push(
                <Notification
                    title={
                        t('community.messages.error') ||
                        'Addition not successful'
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

    const onFormUpdate = async (
        values: CommunityFormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        try {
            const resp = await apiUpdateCommunity({
                ...values,
                cid,
            })

            if (resp.status == 200) {
                // TODO: add english i18n version
                toast.push(
                    <Notification
                        title={t('Update successful') || 'Update successful'}
                        type="success"
                    />,
                    {
                        placement: 'top-center',
                    }
                )

                setSubmitting(false)
                navigate('/communities')
            }
        } catch (error) {
            console.log('error', error)
            toast.push(
                <Notification
                    title={
                        t('Update not successful') || 'Update not successful'
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

    useEffect(() => {
        if (cid) {
            setEditMode(true)
        }
    }, [cid])

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={data}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(true)
                    setTimeout(() => {
                        editMode
                            ? onFormUpdate(values, setSubmitting)
                            : onFormSubmit(values, setSubmitting)
                    }, 1000)
                }}
            >
                {({ values, touched, errors, isSubmitting, resetForm }) => {
                    const validatorProps = { touched, errors }
                    return (
                        <Form className="mb-4">
                            <FormContainer>
                                <FormDesription
                                    title=""
                                    desc="Add community info, like community name, description, avatar, and visibility."
                                />
                                <FormRow
                                    name="name"
                                    label="Community Name"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="name"
                                        placeholder="Community Name"
                                        component={Input}
                                    />
                                </FormRow>
                                <FormRow
                                    name="description"
                                    label="Description"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="description"
                                        placeholder="Description"
                                        textArea
                                        component={Input}
                                        prefix={
                                            <HiOutlineBriefcase className="text-xl" />
                                        }
                                    />
                                </FormRow>

                                <FormRow
                                    name="is_public"
                                    label="Visibility"
                                    {...validatorProps}
                                    border={false}
                                >
                                    <div className="flex">
                                        <Field
                                            name="is_public"
                                            component={Switcher}
                                        />
                                        <div className="ml-3">
                                            {values.is_public
                                                ? 'Public'
                                                : 'Private'}
                                        </div>
                                    </div>
                                </FormRow>
                                <div className="mt-4 ltr:text-right">
                                    <Button
                                        className="ltr:mr-2 rtl:ml-2"
                                        type="button"
                                        onClick={() => {
                                            navigate('/home')
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="solid"
                                        loading={isSubmitting}
                                        type="submit"
                                    >
                                        {editMode ? 'Update' : 'Create'}
                                    </Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
            <CommunitySpecificTemplates />
        </div>
    )
}

export default CreateCommunity
