import React, { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Formik, Form, Field } from 'formik'
import { FormContainer, FormItem } from '@/components/ui/Form'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import useRequestWithNotification from '@/utils/hooks/useRequestWithNotification'
import { apiSetCommunityBadge } from '@/services/BadgeService'
import { useParams } from 'react-router-dom'
import { Alert } from '@/components/ui'

export default function AddCommunityBadgeForm() {
    const [badgeName, setBadgeName] = useState('')
    const [badgeDescription, setBadgeDescription] = useState('')
    const [badgeTier, setBadgeTier] = useState('')
    const [badgeCriteria, setBadgeCriteria] = useState('')
    const communityId = useParams<{ id: string }>().id

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === 'badgeName') {
            setBadgeName(value)
        } else if (name === 'badgeDescription') {
            setBadgeDescription(value)
        } else if (name === 'badgeTier') {
            setBadgeTier(value)
        } else if (name === 'badgeCriteria') {
            setBadgeCriteria(value)
        }
    }

    const dispatch = useDispatch()

    const postAction = () => {
        // Add any post action logic here
    }

    const [handleCreateBadge, isBadgeCreating] = useRequestWithNotification(
        apiSetCommunityBadge,
        'You have successfully created the badge!',
        'Error creating badge',
        postAction
    )

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Please enter a name'),
        description: Yup.string().required('Please enter a description'),
        tier: Yup.string().required('Please enter a tier'),
        criteria: Yup.string().required('Please enter criteria'),
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
                            <FormItem label={'Badge Name'} className="my-5">
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="badgeName"
                                    placeholder={'Badge Name'}
                                    component={Input}
                                    onChange={handleChange}
                                    value={badgeName}
                                />
                            </FormItem>
                            <FormItem
                                label={'Badge Description'}
                                className="my-5"
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="badgeDescription"
                                    placeholder={'Badge Description'}
                                    component={Input}
                                    onChange={handleChange}
                                    value={badgeDescription}
                                />
                            </FormItem>
                            <FormItem label={'Badge Tier'} className="my-5">
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="badgeTier"
                                    placeholder={'Badge Tier'}
                                    component={Input}
                                    onChange={handleChange}
                                    value={badgeTier}
                                />
                            </FormItem>
                            <FormItem label={'Badge Criteria'} className="my-5">
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="badgeCriteria"
                                    placeholder={'Badge Criteria'}
                                    component={Input}
                                    onChange={handleChange}
                                    value={badgeCriteria}
                                />
                            </FormItem>
                            <Alert showIcon className="mb-4" type="info">
                                Please fill in all the fields to create a new
                                badge.
                            </Alert>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                                onClick={() => {
                                    if (
                                        typeof handleCreateBadge === 'function'
                                    ) {
                                        handleCreateBadge({
                                            badgeName,
                                            badgeDescription,
                                            badgeTier,
                                            badgeCriteria,
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
