import React, { useEffect, useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Formik, Form, Field } from 'formik'
import { FormContainer, FormItem } from '@/components/ui/Form'
import * as Yup from 'yup'
import { FieldType } from '@/@types/community'
import { useDispatch } from 'react-redux'
import {
    addTemplate,
    toggleFetchTrigger,
    toggleTemplateDialog,
} from '@/store/slices/community'
import AddFieldForm from './AddFieldForm'
import MapField from './MapField'
import useRequestWithNotification from '@/utils/hooks/useRequestWithNotification'
import { apiAddTemplate } from '@/services/CommunityService'
import { useParams } from 'react-router-dom'
import { defaultTemplate } from '@/utils/helpers'
import { Alert } from '@/components/ui'

export default function AddTemplateForm() {
    const [templateName, setTemplateName] = useState('')
    const [templateDescription, setTemplateDescription] = useState('')
    const communityId = useParams<{ id: string }>().id

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === 'templateName') {
            setTemplateName(value)
        } else if (name === 'templateDescription') {
            setTemplateDescription(value)
        }
    }

    const [fields, setFields] = useState([] as FieldType[])

    const dispatch = useDispatch()

    const handleAddField = (field: FieldType) => {
        setFields([...fields, field])
    }

    const postAction = () => {
        dispatch(toggleTemplateDialog())
        dispatch(toggleFetchTrigger())
    }

    useEffect(() => {
        const defaultTemplateFields = defaultTemplate()
        setFields(defaultTemplateFields)
    }, [])

    const [handleCreateTemplate, isTemplateCreating] =
        useRequestWithNotification(
            apiAddTemplate,
            'You have successfully created the template!',
            'Error leaving community',
            postAction
        )

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Please enter a name'),
        description: Yup.string().required('Please enter a description'),
    })

    return (
        <div className="min-h-fit">
            <Formik
                initialValues={{}}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {}}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form className="mb-3">
                        <FormContainer>
                            <FormItem label={'Template Name'} className="my-5">
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="templateName"
                                    placeholder={'Template Name'}
                                    component={Input}
                                    onChange={handleChange}
                                    value={templateName}
                                />
                            </FormItem>
                            <FormItem
                                label={'Template Description'}
                                className="my-5"
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="templateDescription"
                                    placeholder={'Template Description'}
                                    component={Input}
                                    onChange={handleChange}
                                    value={templateDescription}
                                />
                            </FormItem>
                            <FormItem>
                                <hr />
                            </FormItem>
                            <div className="mb-5">
                                {fields.length > 0 && (
                                    <MapField fields={fields} />
                                )}
                            </div>
                            <Alert showIcon className="mb-4" type="info">
                                The fields above are the default fields for any
                                template. You can add more fields below.
                            </Alert>

                            <AddFieldForm handleSave={handleAddField} />
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                                onClick={() => {
                                    if (
                                        typeof handleCreateTemplate ===
                                        'function'
                                    ) {
                                        handleCreateTemplate({
                                            templateName,
                                            templateDescription,
                                            fields: JSON.stringify(fields),
                                            communityId,
                                        })
                                    }
                                }}
                                color="green-600"
                                className="mt-5"
                            >
                                Save
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}
