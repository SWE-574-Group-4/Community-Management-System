
import React, { useEffect } from 'react'
import Select from '@/components/ui/Select'
import { apiGetLabels } from '@/services/CommunityService'

const formatGroupLabel = (data: any) => (
    <div className="font-bold text-xs uppercase text-gray-800 dark:text-white my-2">
        {data.label}
    </div>
)

export default function Group() {
    const [labels, setLabels] = React.useState([])

    // transform the data to match the format of the Select component
    const transformedLabels = labels.map((label: any) => {
        return {
            label: label.label,
            options: label.tags.map((tag: any) => {
                return {
                    value: tag.value,
                    label: tag.title
                }
            })
        }
    })
    
    useEffect(() => {
        const fetchLabels = async () => {
            try {
                const response = await apiGetLabels()
                if (response.status === 200) {
                    setLabels(response.data as [])
                }
                // fetch default community labels
                console.log('fetching community labels')
            } catch (error) {
                console.error('Error fetching community labels', error)
            }
        }
        
        fetchLabels()
    }, [])

    return (
        <div>
            <Select
                isMulti
                formatGroupLabel={formatGroupLabel}
                options={transformedLabels}
                placeholder="Select labels"
            />
        </div>
    )
}