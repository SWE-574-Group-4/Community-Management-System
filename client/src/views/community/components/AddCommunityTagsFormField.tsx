import React, { useEffect } from 'react'
import Select from '@/components/ui/Select'
// import { apiGetTags } from '@/services/CommunityService'

const formatGroupLabel = (data: any) => (
    <div className="font-bold text-xs uppercase text-gray-800 dark:text-white my-2">
        {data.label}
    </div>
)

export default function AddCommunityTagsFormField({ setCommunityTags }: { setCommunityTags: (tags: any) => void }) {
    const [tags, setTags] = React.useState([])

    // transform the data to match the format of the Select component
    const transformedLabels = tags.map((tag: any) => {
        return {
            value: tag.id,
            label: tag.name
        }
    })

    const handleSelectChange = (selectedOptions: any) => {
        // Transform the selected options back to the original format
        const transformedTags = selectedOptions.map((option: any) => ({
            id: option.value,
            name: option.label
        }));
        setCommunityTags(transformedTags);
    };

    useEffect(() => {
        // const fetchTags = async () => {
        //     try {
        //         const response = await apiGetTags()
        //         if (response.status === 200) {
        //             setTags(response.data as [])
        //             console.log('getting tags', response.data)
        //         }
        //         // fetch default community labels
        //         console.log('fetching community tags')
        //     } catch (error) {
        //         console.error('Error fetching community tags', error)
        //     }
        // }

        // fetchTags()
    }, [])

    return (
        <div>
            <Select
                isMulti
                formatGroupLabel={formatGroupLabel}
                options={transformedLabels}
                onChange={handleSelectChange}
                placeholder="Select labels"
            />
        </div>
    )
}
