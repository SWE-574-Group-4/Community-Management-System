import React from 'react'
import { OptionProps } from 'react-select' // import the OptionProps type
import { HiCheck } from 'react-icons/hi'
import { CommonSelectOptionType } from '@/@types/common'

export const CustomSelectOption = ({
    innerProps,
    label,
    isSelected,
}: OptionProps<CommonSelectOptionType>) => {
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
