import { useRef, useState, SyntheticEvent, useEffect, useCallback } from 'react'
import { apiAdvanceSearch, apiSearch } from '@/services/SearchService'
import {
    CommunityType,
    DataTypeResponse,
    TemplateType,
} from '@/@types/community'
import Community from '../search/components/Community'
import { Button, Card, Checkbox, Radio, Select, Input } from '@/components/ui'
import DatePicker from '@/components/ui/DatePicker'
import Post from './components/Post'
import { PostData } from '@/@types/post'
import TableSearch from '../account/Settings/components/Search/TableSearch'
import { apiGetDataTypes } from '@/services/CommunityService'
import { DatePickerRangeValue } from '@/components/ui/DatePicker/DatePickerRange'
// User search
import User from './components/User'
import { UserResponseType } from '@/@types/user'
import Template from './components/Template'
import axios from 'axios'
import { SingleValue } from 'react-select'

const { DatePickerRange } = DatePicker

const CustomCheckboxGroup = ({
    setCheckboxList,
    checkboxList,
}: {
    setCheckboxList: (options: (string | number)[]) => void
    checkboxList: (string | number)[]
}) => {
    const onCheckboxChange = (
        options: (string | number)[],
        e: SyntheticEvent
    ) => {
        setCheckboxList(options)
    }
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
    >(['text'])

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
        <Checkbox.Group
            value={checkboxList}
            onChange={onCheckboxChange}
            className="grid grid-cols-12 gap-1"
        >
            {dataTypes.map((dataType) => {
                return (
                    <Checkbox
                        className="lg:col-span-2 md:col-span-4 sm:col-span-6 col-span-6"
                        name="dataTypes"
                        value={dataType}
                    >
                        {dataType.toLocaleUpperCase()}
                    </Checkbox>
                )
            })}
        </Checkbox.Group>
    )
}

const Search = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [data, setData] = useState<any>(null)
    const [checkboxList, setCheckboxList] = useState<(string | number)[]>([])
    const [range, setRange] = useState<DatePickerRangeValue>([
        new Date(),
        new Date(),
    ])
    const [searchType, setSearchType] = useState('community')
    const [templates, setTemplates] = useState<TemplateType[]>([])
    const [selectedTemplate, setSelectedTemplate] =
        useState<TemplateType | null>(null)
    const [templateFields, setTemplateFields] = useState<{
        [key: string]: string
    }>({})

    useEffect(() => {
        const fetchTemplates = async () => {
            const formData = new FormData()
            formData.append('query', '')
            formData.append('searchType', 'template')
            formData.append('range[]', new Date().toISOString())
            formData.append('range[]', new Date().toISOString())

            const response = await axios.post(
                'http://127.0.0.1:8000/advance_search/',
                formData
            )
            setTemplates(response.data.data)
        }
        fetchTemplates()
    }, [])

    const onChange = (val: string) => {
        setSearchType(val)
    }

    const handleInputChange = useCallback(
        async (val: string) => {
            const query = val

            try {
                const _response = await apiAdvanceSearch({
                    query,
                    dataTypes: checkboxList,
                    searchType,
                    range,
                    template: selectedTemplate?.id,
                    templateFields,
                })

                setData(_response.data)
                // Handle the response data here
            } catch (error) {
                // Handle any errors here
            }
        },
        [checkboxList, searchType, range, selectedTemplate, templateFields]
    )

    useEffect(() => {
        handleInputChange(inputRef.current?.value || '')
    }, [handleInputChange])

    useEffect(() => {
        if (!range[0] && !range[1]) {
            handleInputChange(inputRef.current?.value || '')
        }

        if (range[0] && range[1]) {
            handleInputChange(inputRef.current?.value || '')
        }
    }, [range, handleInputChange])

    const handleTemplateChange = (
        newValue: SingleValue<{ label: string; value: number | undefined }>
    ) => {
        const templateId = newValue?.value
        const template = templates.find((t) => t.id === templateId)
        setSelectedTemplate(template || null)
        setTemplateFields({})
    }

    const handleFieldChange = (field: string, value: string) => {
        setTemplateFields((prev) => ({ ...prev, [field]: value }))
    }

    const handleSearchClick = () => {
        handleInputChange(inputRef.current?.value || '')
    }

    return (
        <div className="">
            <div className="lg:flex justify-between mb-4">
                <div className="flex flex-col lg:flex-row">
                    <TableSearch
                        ref={inputRef}
                        onInputChange={handleInputChange}
                    />
                    <Radio.Group
                        value={searchType}
                        onChange={onChange}
                        className="mr-2 h-10 flex items-center"
                    >
                        <Radio value={'community'} className="lg:ml-2">
                            Community
                        </Radio>
                        <Radio value={'template'}>Template</Radio>
                        <Radio value={'post'}>Post</Radio>
                        <Radio value={'user'}>User</Radio>
                    </Radio.Group>
                </div>
            </div>

            {searchType === 'template' && (
                <>
                    <Select
                        placeholder="Select a template"
                        onChange={handleTemplateChange}
                        options={templates.map((template) => ({
                            label: template.name,
                            value: template.id,
                        }))}
                    />
                    {selectedTemplate && (
                        <div className="mt-4">
                            {selectedTemplate.fields
                                .filter(
                                    (field) =>
                                        field.field_type !== 'image' &&
                                        field.field_type !== 'video' &&
                                        field.field_type !== 'audio'
                                )
                                .map((field) => (
                                    <div
                                        key={field.field_name}
                                        className="mb-2"
                                    >
                                        <label>{field.field_name}</label>
                                        <Input
                                            type="text"
                                            value={
                                                templateFields[
                                                    field.field_name
                                                ] || ''
                                            }
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    field.field_name,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                ))}
                        </div>
                    )}
                    <Button onClick={handleSearchClick}>Search</Button>
                </>
            )}

            {searchType === 'post' && (
                <CustomCheckboxGroup
                    setCheckboxList={setCheckboxList}
                    checkboxList={checkboxList}
                />
            )}

            {searchType == 'community' && data && (
                <Card className="mt-5">
                    <h5>Communities:</h5>
                    {data.data.map((community: CommunityType) => {
                        return <Community community={community} />
                    })}
                </Card>
            )}

            {searchType === 'post' && data && (
                <Card className="mt-5">
                    <h5>Posts:</h5>
                    {data.data.map((post: PostData) => {
                        return <Post post={post} />
                    })}
                </Card>
            )}
            {/* User Results */}
            {searchType === 'user' && data && (
                <Card className="mt-5">
                    <h5>Users:</h5>
                    {data.data.map((user: UserResponseType) => (
                        <User key={user.id} user={user} />
                    ))}
                </Card>
            )}

            {searchType === 'template' && data && (
                <Card className="mt-5">
                    <h5>Community Specific templates:</h5>
                    {data.data.map((template: TemplateType) => (
                        <Template
                            key={template.id}
                            template={template}
                            checkboxList={checkboxList}
                        />
                    ))}
                </Card>
            )}
        </div>
    )
}

export default Search
