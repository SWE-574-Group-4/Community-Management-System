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
import { Alert, Select } from '@/components/ui'

const criteriaOptions = [
    { value: 'posts_count', label: 'Post Count' },
    { value: 'comments_count', label: 'Comment Count' },
    { value: 'single_post_comments', label: 'Single Post Comment' },
    { value: 'single_post_likes', label: 'Single Post Like' },
    { value: 'likes_given', label: 'Likes Given' },
    { value: 'membership_duration_days', label: 'Membership Duration' },
]

const badgeImages = [
    'badge.png',
    'diploma.png',
    'medal.png',
    'money-bag.png',
    'reward.png',
    'shield.png',
    'trophy_1.png',
    'trophy_2.png',
    'trophy_3.png',
    'trophy.png',
]

export default function AddCommunityBadgeForm() {
    const [badgeName, setBadgeName] = useState('')
    const [badgeDescription, setBadgeDescription] = useState('')
    const [badgeTier, setBadgeTier] = useState('')
    const [badgeCriteria, setBadgeCriteria] = useState('')
    const [criteriaValue, setCriteriaValue] = useState('')
    const [selectedImage, setSelectedImage] = useState('')
    const communityId = useParams<{ id: string }>().id || ''

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === 'badgeName') {
            setBadgeName(value)
        } else if (name === 'badgeDescription') {
            setBadgeDescription(value)
        } else if (name === 'badgeTier') {
            setBadgeTier(value)
        } else if (name === 'criteriaValue') {
            setCriteriaValue(value)
        }
    }

    const handleCriteriaChange = (selectedOption: any) => {
        setBadgeCriteria(selectedOption.value)
        setCriteriaValue('')
    }

    const dispatch = useDispatch()

    const postAction = () => {
        // Add any post action logic here
    }

    const [createBadgeRequest, isBadgeCreating] = useRequestWithNotification(
        apiSetCommunityBadge,
        'You have successfully created the badge!',
        'Error creating badge',
        postAction
    )

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Please enter a name'),
        description: Yup.string().required('Please enter a description'),
        tier: Yup.string().required('Please enter a tier'),
        criteria: Yup.string().required('Please select a criteria'),
        criteriaValue: Yup.string().required(
            'Please enter a value for the selected criteria'
        ),
    })

    const handleCreateBadge = async () => {
        const criteria = {
            [badgeCriteria]: Number(criteriaValue), // Parse criteria value to number
        }
        await apiSetCommunityBadge({
            badgeName,
            badgeDescription,
            badgeTier,
            badgeCriteria: JSON.stringify(criteria), // Ensure criteria is a JSON string
            communityId,
            icon: selectedImage, // Add selected image to the payload
        })
    }

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
                                <Select
                                    options={criteriaOptions}
                                    onChange={handleCriteriaChange}
                                    value={criteriaOptions.find(
                                        (option) =>
                                            option.value === badgeCriteria
                                    )}
                                />
                            </FormItem>
                            {badgeCriteria && (
                                <FormItem
                                    label={`Enter ${badgeCriteria.replace(
                                        '_',
                                        ' '
                                    )}`}
                                    className="my-5"
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="criteriaValue"
                                        placeholder={`Enter ${badgeCriteria.replace(
                                            '_',
                                            ' '
                                        )}`}
                                        component={Input}
                                        onChange={handleChange}
                                        value={criteriaValue}
                                    />
                                </FormItem>
                            )}
                            <FormItem
                                label={'Select Badge Icon'}
                                className="my-5"
                            >
                                <div className="grid grid-cols-3 gap-2">
                                    {badgeImages.map((image) => (
                                        <img
                                            key={image}
                                            src={`/img/badges/community_badges/${image}`} // Ensure the path is correct
                                            alt={image}
                                            className={`w-16 h-16 cursor-pointer ${
                                                selectedImage === image
                                                    ? 'border-2 border-blue-500'
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                setSelectedImage(image)
                                            }
                                        />
                                    ))}
                                </div>
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
                                        handleCreateBadge()
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
