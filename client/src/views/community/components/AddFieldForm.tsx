import React, { useEffect, useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Form, Field } from 'formik'
import { FormContainer } from '@/components/ui/Form'
import { apiGetDataTypes } from '@/services/CommunityService'
import { apiFetchWikidataResults } from '@/services/PostService'
import { DataTypeOption, DataTypeResponse, FieldType } from '@/@types/community'
import { Select, Switcher } from '@/components/ui'
import AsyncSelect from 'react-select/async'
import { toSentenceCase } from '@/utils/helpers'

export default function AddFieldForm({
    handleSave,
}: {
    handleSave: (field: FieldType) => void
}) {
    const [field, setField] = useState({
        field_name: '',
        field_type: '',
        isRequired: false,
        keyword_id: '', // Single field for enumerated type
        preferred_keyword: '', // Track the selected label
    })

    const [dataTypes, setDataTypes] = useState<
        (
            | 'text'
            | 'date'
            | 'geolocation'
            | 'enumerated'
            | 'number'
            | 'image'
            | 'video'
            | 'audio'
            | 'file'
        )[]
    >([])


    useEffect(() => {
        const fetchDataType = async () => {
            const resp = await apiGetDataTypes()
            if (resp.status === 200) {
                setDataTypes(
                    (resp.data as DataTypeResponse['data_types']) || []
                )
            }
        }
        fetchDataType()
    }, [])

    const dataTypeOptions: DataTypeOption[] = dataTypes.map((dataType) => ({
        value: dataType,
        label: toSentenceCase(dataType),
    }))

    // Fetch options dynamically based on user input
    const fetchOptions = async (inputValue: string) => {
        if (!inputValue.trim()) return [] // Prevent unnecessary API calls for empty input

        try {
            const response = await apiFetchWikidataResults(inputValue)
            return (response.data as { id: string; label: string }[]).map((item) => ({
                value: item.id,
                label: item.label,
            }))
        } catch (error) {
            console.error('Error fetching enumerated options:', error)
            return [] // Return an empty array on error
        }
    }

    return (
        <div className="max-h-96 overflow-hidden overflow-y-auto custom-scrollbar">
            <Form className="mb-3">
                <FormContainer>
                    <Field
                        name={'field_name'}
                        type="text"
                        autoComplete="off"
                        value={field.field_name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setField({ ...field, field_name: e.target.value })
                        }
                        placeholder="Field Name"
                        component={Input}
                        className="mb-1"
                    />

                    <Select<DataTypeOption>
                        className="mb-4"
                        name="field_type"
                        options={dataTypeOptions}
                        placeholder={'Select a data type'}
                        value={dataTypeOptions.find(
                            (option) => option.value === field.field_type
                        )}
                        onChange={(option) => {
                            setField({
                                ...field,
                                field_type: option?.value ?? '',
                                keyword_id: '', // Clear enumerated-specific fields
                            })
                        }}
                    />

                    {/* Single Searchable Dropdown for Enumerated Field */}
                    {field.field_type === 'enumerated' && (
                        <div className="mb-4">
                            <AsyncSelect
                                cacheOptions
                                loadOptions={fetchOptions}
                                defaultOptions
                                onChange={(selectedOption) =>
                                    setField({
                                        ...field,
                                        keyword_id: selectedOption?.value || '',
                                        preferred_keyword: selectedOption?.label || '', // Track the selected label
                                    })
                                }
                                placeholder="Search and select an option"
                                value={
                                    field.keyword_id
                                        ? { value: field.keyword_id, label: field.preferred_keyword }
                                        : null
                                }
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium">
                            Required
                        </label>
                    </div>
                    <Switcher
                        checked={field.isRequired}
                        onChange={(
                            checked: boolean,
                            e: React.ChangeEvent<HTMLInputElement>
                        ) => {
                            setField({
                                ...field,
                                isRequired: e.target.checked,
                            })
                        }}
                        name="isRequired"
                        className="mb-5"
                    />

                    <Button
                        block
                        variant="twoTone"
                        type="button"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            handleSave(field)
                            setField({
                                field_name: '',
                                field_type: '',
                                isRequired: false,
                                keyword_id: '',
                                preferred_keyword: '',
                            })
                        }}
                        disabled={!field.field_name || !field.field_type}
                    >
                        Add field
                    </Button>
                </FormContainer>
            </Form>
        </div>
    )
}
