import React, { useEffect, useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Form, Field } from 'formik'
import { FormContainer } from '@/components/ui/Form'
import { apiGetDataTypes } from '@/services/CommunityService'
import { DataTypeOption, DataTypeResponse, FieldType } from '@/@types/community'
import { Select, Switcher } from '@/components/ui'
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
    })

    const [dataTypes, setDataTypes] = useState<
        (
            | 'text'
            | 'date'
            | 'geolocation'
            | 'number'
            | 'image'
            | 'video'
            | 'audio'
            | 'file'
        )[]
    >([])

    const options: DataTypeOption[] = dataTypes?.map((dataType) => ({
        value: dataType,
        label: toSentenceCase(dataType),
    }))

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setField({
            ...field,
            [name]: value,
        })
    }

    useEffect(() => {
        const fetchDataType = async () => {
            const resp = await apiGetDataTypes()
            if (resp.status == 200) {
                setDataTypes(
                    (resp.data as DataTypeResponse['data_types']) || []
                )
            }
        }
        fetchDataType()
    }, [])

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
                            handleChange(e)
                        }
                        placeholder="Field Name"
                        component={Input}
                        className="mb-1"
                    />

                    <Select<DataTypeOption>
                        className="mb-1"
                        name="field_type"
                        options={options}
                        placeholder={'Select a data type'}
                        value={options.find(
                            (option) => option.value === field.field_type
                        )}
                        onChange={(option) => {
                            setField({
                                ...field,
                                field_type: option?.value ?? '',
                            })
                        }}
                    />

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
