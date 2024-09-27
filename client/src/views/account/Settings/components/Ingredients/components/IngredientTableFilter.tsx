import type { OptionProps } from 'react-select'
import { Dispatch, SetStateAction } from 'react'

import { HiCheck } from 'react-icons/hi'
import Select from '@/components/ui/Select'

type CategoryOption = {
    id: string
    value: string
    label: string
}

const CustomSelectOption = ({
    innerProps,
    label,
    isSelected,
}: OptionProps<CategoryOption>) => {
    return (
        <div
            className={`flex items-center justify-between p-2 ${
                isSelected
                    ? 'bg-gray-100 dark:bg-gray-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
            {...innerProps}
        >
            <div className="flex items-center">
                <span className="ml-2 rtl:mr-2">{label}</span>
            </div>
            {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
        </div>
    )
}

interface MealTableFilterProps {
    mealCategories: CategoryOption[]
    categoryQuery: string
    setCategoryQuery: Dispatch<SetStateAction<string>>
}

const MealTableFilter = (props: MealTableFilterProps) => {
    const { mealCategories, categoryQuery, setCategoryQuery } = props

    return (
        <div>
            <Select
                options={mealCategories}
                placeholder={'Kategoriler'}
                components={{
                    Option: CustomSelectOption,
                }}
                className="mb-4 max-w-md md:w-52"
                value={
                    mealCategories.find(
                        (option) => option.id == categoryQuery
                    ) || null
                }
                onChange={(selectedOption) => {
                    if (selectedOption) {
                        const id = (selectedOption as CategoryOption).id
                        setCategoryQuery(id) // Update the category query state
                    } else {
                        setCategoryQuery('') // Clear the category query state
                    }
                }}
            />
        </div>
    )
}

export default MealTableFilter
