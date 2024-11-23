import { useRef, useState, SyntheticEvent, useEffect, useCallback } from 'react'
import { apiAdvanceSearch, apiSearch } from '@/services/SearchService'
import {
    CommunityType,
    DataTypeResponse,
    TemplateType,
} from '@/@types/community'
import Community from '../search/components/Community'
import { Button, Card, Checkbox, Radio } from '@/components/ui'
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
                })

                setData(_response.data)
                // Handle the response data here
            } catch (error) {
                // Handle any errors here
            }
        },
        [checkboxList, searchType, range] // Add the missing dependencies: range
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

            {(searchType === 'post' || searchType === 'template') && (
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
