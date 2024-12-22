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
import { apiGetTags } from '@/services/PostService'
import { Select } from '@/components/ui'

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, 'Too Short!')
        .max(200, 'Too Long!')
        .required('Community Name Required'),
    description: Yup.string(),
    avatar: Yup.string(),
    isPublic: Yup.boolean(),
    rules: Yup.string()
    .min(3, 'Rule is too short')
    .max(500, 'Rule is too long'),
})

const CreateCommunity = () => {
    const [data, setData] = useState<CommunityFormModel>({
        name: '',
        description: '',
        is_public: true,
        rules: '',
    })
    const cid = useParams<{ id: string }>().id
    const [editMode, setEditMode] = useState(false)
    const [tags, setTags] = useState<{ value: number; label: string }[]>([])
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    // const [selectedTags, setSelectedTags] = useState<{ value: number; label: string }[]>([])
    const navigate = useNavigate()
    const userId = useAppSelector((state) => state.auth.user?.id)
    const fetchTrigger = useAppSelector(
        (state) => state.community.community.fetchTrigger
    )

    const community = cid ? useFetchCommunity(cid, fetchTrigger) : null

    useEffect(() => {
        if (community) {
            console.log('community', community)

            const { name, description, is_public, rules } = community
            setData({
                name,
                description,
                is_public,
                rules,
            })
        } 
    }, [community])

    const fetchTags = async () => {
        if (searchQuery.length < 3) {
            alert('Please enter at least 3 characters for the search.');
            return;
        }
        try {
            const response = await apiGetTags(searchQuery);
            if (response.status === 200) {
                setSearchResults(response.data.results || []);
                console.log('search results', searchResults);
            }
            // fetch default community labels
            console.log('fetching community tags')
        } catch (error) {
            console.error('Error fetching community tags', error)
        }
    }

    const addTag = (e: React.MouseEvent<HTMLButtonElement>, tag: any) => {
        e.preventDefault();
        if (!selectedTags.some((t) => t.id === tag.id)) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const removeTag = (tagId: string) => {
        setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
    };

    const handleCommunityTagsChange = (selectedOptions: any) => {
        console.log('selectedOptions', selectedOptions)
        setSelectedTags(selectedOptions)
    }

    const onFormSubmit = async (
        values: CommunityFormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const tags = selectedTags.map((tag: any) => tag.id);
        console.log('tags', tags)
        try {
            const resp = await apiAddCommunity({
                ...values,
                userId,
                tags: tags
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
                tagIds: selectedTags.map((tag: any) => tag.id),
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
                                    desc="Add community info, like community name, description, and visibility."
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
                                    name="rules"
                                    label="Community Rules"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="rules"
                                        placeholder="Add a community rule"
                                        textArea
                                        component={Input}
                                    />
                                </FormRow>

                                <FormRow
                                    name="description"
                                    label="Tags"
                                    {...validatorProps}
                                >
                                    <div className="form-group">
                                        <label>Search for Tags:</label>
                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: '10px',
                                                marginBottom: '10px',
                                            }}
                                        >
                                            <input
                                                type="text"
                                                placeholder="Search for tags..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                style={{
                                                    flex: 1,
                                                    padding: '8px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                onClick={fetchTags}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#4CAF50',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Search
                                            </Button>
                                        </div>

                                        {searchResults.length > 0 && (
                                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                                {searchResults.map((result: any) => (
                                                    <li
                                                        key={result.id}
                                                        style={{
                                                            marginBottom: '5px',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            border: '1px solid #ccc',
                                                            padding: '5px 10px',
                                                            borderRadius: '4px',
                                                        }}
                                                    >
                                                        <span>
                                                            <strong>{result.label}</strong> -{' '}
                                                            {result.description}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => addTag(e, result)}
                                                            style={{
                                                                padding: '5px 10px',
                                                                backgroundColor: '#007BFF',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            Select
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {selectedTags.length > 0 && (
                                    <div>
                                        <h4>Selected Tags</h4>
                                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                                            {selectedTags.map((tag: any) => (
                                                <li
                                                    key={tag.id}
                                                    style={{
                                                        marginBottom: '5px',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        border: '1px solid #ccc',
                                                        padding: '5px 10px',
                                                        borderRadius: '4px',
                                                    }}
                                                >
                                                    <span>{tag.label}</span>
                                                    <button
                                                        onClick={() => removeTag(tag.id)}
                                                        style={{
                                                            padding: '5px 10px',
                                                            backgroundColor: '#f44336',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                    {/* <Select
                                        isMulti
                                        options={tags}
                                        value={selectedTags}
                                        onChange={handleCommunityTagsChange}
                                        placeholder="Select labels"
                                    /> */}
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
                                            {'Public'}
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
            {editMode && <CommunitySpecificTemplates />}
        </div>
    )
}

export default CreateCommunity
