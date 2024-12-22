import { FieldType } from '@/@types/community'
import { Button } from '@/components/ui'
import { FormItem } from '@/components/ui/Form'
import { toSentenceCase } from '@/utils/helpers'
import useFieldToComponent from '@/utils/hooks/useFieldToComponent'
import { HiOutlineDocumentAdd } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toggleFetchTrigger, useAppSelector } from '@/store'
import useRequestWithNotification from '@/utils/hooks/useRequestWithNotification'
import { apiGetTags, apiPost, apiFetchEnumeratedOptions, apiTriggerRelatedEntities } from '@/services/PostService'
import { useDispatch } from 'react-redux'
import RenderGeo from './RenderGeo'
import Select from '@/components/ui/Select'
import { MultiValue } from 'react-select'
import axios, { AxiosResponse } from 'axios'
import { Notification, Tag, toast } from '@/components/ui'

const FieldComponent = ({
    field,
    value,
    onChange,
}: {
    field: FieldType
    value: string
    onChange: (value: string) => void
}) => {
    const [latitude, setLatitude] = useState<number | null>(null)
    const [longitude, setLongitude] = useState<number | null>(null)
    const Component = useFieldToComponent(field.field_type)
    const field_name = toSentenceCase(field.field_name)
    const navigate = useNavigate()
    const [options, setOptions] = useState<{ value: string; label: string }[]>([])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
    }

    useEffect(() => {
        if (field.field_type === 'geolocation') {
            // Geolocation API
            if (navigator.geolocation) {
                // what to do if supported
                navigator.geolocation.getCurrentPosition((position) => {
                    onChange(
                        `[${position.coords.latitude}, ${position.coords.longitude}]`
                    )

                    setLatitude(position.coords.latitude)
                    setLongitude(position.coords.longitude)
                    console.log('Latitude: ', position.coords.latitude)
                    console.log('Longitude: ', position.coords.longitude)
                })
            } else {
                // display an error if not supported
                console.error('Geolocation is not supported by this browser.')
                onChange('Geolocation is not supported by this browser.')
            }
        } else if (field.field_type === 'enumerated' && field.keyword_id) {
            try {
                const fetchOptions = async () => {
                    if (field.keyword_id) {
                        const response = await apiFetchEnumeratedOptions(field.keyword_id)
                        setOptions((response.data as { id: string; label: string }[]).map((item) => ({
                            label: item.label,
                            value: item.label,
                        })))
                    }
                }
                fetchOptions()
            } catch (error) {
                console.error('Error fetching enumerated options:', error)
            }
        }
    }, [field.field_type, field.keyword_id])

    return (
        <FormItem
            key={field_name}
            label={field_name}
            invalid={false}
            errorMessage=""
            asterisk={field.isRequired}
        >
            {Component && (
            <Component
                type={
                field.field_type == 'image' ? 'text' : field.field_type
                }
                className={
                field.field_type == 'geolocation' || field.field_type == 'enumerated' ? 'hidden' : ''
                }
                name={field_name}
                placeholder={field_name}
                value={value}
                onChange={handleChange}
            />
            )}

            {field.field_type === 'geolocation' && (
            <RenderGeo coordinates={[latitude, longitude]} />
            )}

            {field.field_type === 'enumerated' ?
            <Select
                options={options}
                value={options.find((option) => option.value === value) || null}
                onChange={(selectedOption) => onChange(selectedOption?.value || '')}
            /> : null
        }
        </FormItem>
    )
}

export default function MapFields({ fields }: { fields: FieldType[] }) {
    const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>(
        {}
    );

    const { id } = useParams<{ id: string }>();
    const userId = useAppSelector((state) => state.auth.user?.id);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [handlePost, isPosting] = useRequestWithNotification(
        apiPost,
        'You have successfully posted!',
        'Error posting',
        () => dispatch(toggleFetchTrigger())
    );

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

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

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = fields.map((field) => ({
            field_name: field.field_name,
            field_type: field.field_type,
            field_value: fieldValues[field.field_name] || '',
        }));

        const tags = selectedTags.map((tag) => tag.id);

        try {
            // Submit the post
            await apiPost(id, userId, formData, tags);

            // Trigger related entities fetching for each tag
            for (const tagId of tags) {
                try {
                    await apiTriggerRelatedEntities(tagId);
                    console.log(`Related entities fetched for tag ${tagId}`);
                } catch (fetchError) {
                    console.error(
                        `Error fetching related entities for tag ${tagId}:`,
                        fetchError
                    );
                }
            }

            // Navigate to the homepage
            navigate('/');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleFieldChange = (name: string, value: string) => {
        setFieldValues((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const initialValues: { [key: string]: string } = {};
        fields.forEach((field) => {
            initialValues[field.field_name] = '';
        });
        setFieldValues(initialValues);
    }, [fields]);

    return (
        <form onSubmit={handleFormSubmit}>
            <div>
                {fields.map((field) => (
                    <FieldComponent
                        key={field.field_name}
                        field={field}
                        value={fieldValues[field.field_name] || ''}
                        onChange={(value) =>
                            handleFieldChange(field.field_name, value)
                        }
                    />
                ))}

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

                <Button
                    className="mt-5 flex items-center justify-center gap-x-0.5"
                    size="sm"
                    variant="solid"
                    color="emerald-600"
                    block
                    type="submit"
                    disabled={Object.values(fieldValues).every(
                        (value) => value === ''
                    )}
                >
                    <HiOutlineDocumentAdd className="" />
                    <span>Post</span>
                </Button>
            </div>
        </form>
    );
}