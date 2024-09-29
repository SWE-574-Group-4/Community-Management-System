import { FieldType } from '@/@types/community'
import { Button } from '@/components/ui'
import { FormItem } from '@/components/ui/Form'
import { toSentenceCase } from '@/utils/helpers'
import useFieldToComponent from '@/utils/hooks/useFieldToComponent'
import { HiOutlineDocumentAdd } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toggleFetchTrigger, useAppSelector } from '@/store'
import useRequestWithNotification from '@/utils/hooks/useRequestWithNotification'
import { apiPost } from '@/services/PostService'
import { useDispatch } from 'react-redux'
import RenderGeo from './RenderGeo'

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
        }
    }, [field.field_type])

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
                        field.field_type == 'geolocation' ? 'hidden' : ''
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
        </FormItem>
    )
}

export default function MapFields({ fields }: { fields: FieldType[] }) {
    const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>(
        {}
    )

    const { id } = useParams<{ id: string }>()
    const userId = useAppSelector((state) => state.auth.user?.id)
    const dispatch = useDispatch()

    const [handlePost, isPosting] = useRequestWithNotification(
        apiPost,
        'You have successfully posted!',
        'Error posting',
        () => dispatch(toggleFetchTrigger())
    )

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = fields.map((field) => ({
            field_name: field.field_name,
            field_type: field.field_type,
            field_value: fieldValues[field.field_name] || '',
        }))

        // TODO: why is this not notifyin the user that the post was successful?
        // turn form data into a string with JSON.stringify
        if (typeof handlePost === 'function') {
            handlePost(id, userId, JSON.stringify(formData))
        }
    }

    const handleFieldChange = (name: string, value: string) => {
        setFieldValues((prev) => ({ ...prev, [name]: value }))
    }

    useEffect(() => {
        const initialValues: { [key: string]: string } = {}
        fields.forEach((field) => {
            initialValues[field.field_name] = ''
        })

        setFieldValues(initialValues)
    }, [fields])

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
    )
}
