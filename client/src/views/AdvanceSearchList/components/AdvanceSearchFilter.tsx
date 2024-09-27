import { useState, useRef, forwardRef, useEffect } from 'react'
import { HiOutlineFilter, HiOutlineSearch } from 'react-icons/hi'
import {
    getAdvanceSearch,
    setFilterData,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Radio from '@/components/ui/Radio'
import Drawer from '@/components/ui/Drawer'
import { DataTypeResponse } from '@/@types/community'

import { Field, Form, Formik, FormikProps, FieldProps } from 'formik'
import type { MouseEvent } from 'react'
import { apiGetDataTypes } from '@/services/CommunityService'

type FormModel = {
    name: string
    dataTypes: string[]
    search_type: number
}

type FilterFormProps = {
    onSubmitComplete?: () => void
}

type DrawerFooterProps = {
    onSaveClick: (event: MouseEvent<HTMLButtonElement>) => void
    onCancel: (event: MouseEvent<HTMLButtonElement>) => void
}

const FilterForm = forwardRef<FormikProps<FormModel>, FilterFormProps>(
    ({ onSubmitComplete }, ref) => {
        const dispatch = useAppDispatch()
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

        const filterData = useAppSelector(
            (state) => state.advanceSearchList.data.filterData
        )

        const tableData = useAppSelector(
            (state) => state.advanceSearchList.data.tableData
        )

        const handleSubmit = (values: FormModel) => {
            onSubmitComplete?.()
            dispatch(setFilterData(values))
            dispatch(getAdvanceSearch(tableData))
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
            <Formik
                enableReinitialize
                innerRef={ref}
                initialValues={filterData}
                onSubmit={(values) => {
                    handleSubmit(values)
                }}
            >
                {({ values, touched, errors }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                invalid={errors.name && touched.name}
                                errorMessage={errors.name}
                            >
                                <h6 className="mb-4">Included text</h6>
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="name"
                                    placeholder="Keyword"
                                    component={Input}
                                    prefix={
                                        <HiOutlineSearch className="text-lg" />
                                    }
                                />
                            </FormItem>
                            <FormItem
                                invalid={errors.dataTypes && touched.dataTypes}
                                errorMessage={errors.dataTypes as string}
                            >
                                <h6 className="mb-4">Data Types </h6>
                                <Field name="dataTypes">
                                    {({ field, form }: FieldProps) => (
                                        <>
                                            <Checkbox.Group
                                                vertical
                                                value={values.dataTypes}
                                                onChange={(options) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        options
                                                    )
                                                }
                                            >
                                                {dataTypes?.map((dataType) => (
                                                    <Checkbox
                                                        className="mb-3"
                                                        name={field.name}
                                                        value={dataType}
                                                    >
                                                        {dataType.toLocaleUpperCase()}
                                                    </Checkbox>
                                                ))}
                                            </Checkbox.Group>
                                        </>
                                    )}
                                </Field>
                            </FormItem>
                            {false && (
                                <FormItem
                                    invalid={
                                        errors.search_type &&
                                        touched.search_type
                                    }
                                    errorMessage={errors.search_type}
                                >
                                    <h6 className="mb-4">Search in . . .</h6>
                                    <Field name="search_type">
                                        {({ field, form }: FieldProps) => (
                                            <Radio.Group
                                                vertical
                                                value={values.search_type}
                                                onChange={(val) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        val
                                                    )
                                                }
                                            >
                                                <Radio value={0}>
                                                    Community
                                                </Radio>
                                                <Radio value={1}>Post</Radio>
                                                <Radio value={2}>User</Radio>
                                            </Radio.Group>
                                        )}
                                    </Field>
                                </FormItem>
                            )}
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        )
    }
)

const DrawerFooter = ({ onSaveClick, onCancel }: DrawerFooterProps) => {
    return (
        <div className="text-right w-full">
            <Button size="sm" className="mr-2" onClick={onCancel}>
                Cancel
            </Button>
            <Button size="sm" variant="solid" onClick={onSaveClick}>
                Query
            </Button>
        </div>
    )
}

const AdvanceSearchFilter = () => {
    const formikRef = useRef<FormikProps<FormModel>>(null)

    const [isOpen, setIsOpen] = useState(false)

    const openDrawer = () => {
        setIsOpen(true)
    }

    const onDrawerClose = () => {
        setIsOpen(false)
    }

    const formSubmit = () => {
        formikRef.current?.submitForm()
    }

    return (
        <>
            <Button
                size="sm"
                className="block md:inline-block ltr:md:ml-2 rtl:md:mr-2 md:mb-0 mb-4"
                icon={<HiOutlineFilter />}
                onClick={() => openDrawer()}
            >
                Filter
            </Button>
            <Drawer
                title="Filter"
                isOpen={isOpen}
                footer={
                    <DrawerFooter
                        onCancel={onDrawerClose}
                        onSaveClick={formSubmit}
                    />
                }
                onClose={onDrawerClose}
                onRequestClose={onDrawerClose}
            >
                <FilterForm ref={formikRef} onSubmitComplete={onDrawerClose} />
            </Drawer>
        </>
    )
}

FilterForm.displayName = 'FilterForm'

export default AdvanceSearchFilter
