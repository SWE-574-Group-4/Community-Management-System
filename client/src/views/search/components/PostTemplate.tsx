import { TemplateResponse, TemplateType } from '@/@types/community'
import React, { useEffect, useState } from 'react'
import { Select } from '@/components/ui'
import { CustomSelectOption } from '@/components/shared/CustomSelectOption'
import { CommonSelectOptionType } from '@/@types/common'

export default function PostTemplate({
    templates,
}: {
    templates: TemplateType[]
}) {
    const [template, setTemplate] = useState<string>('') // Change the type to string
    const [_templates, setTemplates] = useState<CommonSelectOptionType[]>([])
    const [selectedTemplates, setSelectedTemplates] = useState<TemplateType[]>(
        []
    )

    useEffect(() => {
        const options = templates.map((template) => ({
            value: template?.id?.toString() ?? '',
            label: template?.name,
            id: template?.id?.toString() ?? '',
        }))
        setTemplates(options)
    }, [templates])

    const handleTemplateChange = (selectedOption: CommonSelectOptionType[]) => {
        const selected = selectedOption
            .map((option) => {
                return templates.find(
                    (template) => template?.id?.toString() === option.value
                )
            })
            .filter(Boolean) as TemplateType[]

        setSelectedTemplates(selected)
        console.log('Selected Templates:', selected)
    }

    return (
        <div>
            <Select
                options={_templates}
                placeholder={'Templates'}
                components={{
                    Option: CustomSelectOption,
                }}
                className="mb-4 max-w-md md:w-52"
                value={_templates.filter((option) =>
                    selectedTemplates.some(
                        (template) => template?.id?.toString() === option.value
                    )
                )}
                isMulti
                onChange={handleTemplateChange}
            />
        </div>
    )
}
