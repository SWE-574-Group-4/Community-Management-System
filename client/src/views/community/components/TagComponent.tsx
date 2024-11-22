
import Tag from '@/components/ui/Tag'
import { apiGetCommunityTags } from '@/services/CommunityService'
import React, { useEffect } from 'react'
import { HiPlusCircle, HiX } from 'react-icons/hi'

function TagComponent(community: any) {
    const [tags, setTags] = React.useState<{ id: number; name: string }[]>([])

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await apiGetCommunityTags()
                if (response.status === 200) {
                    setTags(response.data as [])
                    console.log('getting tags', response.data)
                }
                // fetch default community labels
                console.log('fetching specific community tags')
            } catch (error) {
                console.error('Error fetching specific community tags', error)
            }
        }
        fetchTags()
    }, [])
    
    return (
        <div className="flex">
            {tags.map((tag) => (
                <div key={tag.id} className="mr-2 rtl:ml-2">                    
                    <Tag prefix prefixClass="bg-emerald-500">
                        {tag.name}
                    </Tag>
            </div>
            ))}
        </div>
    )
}

export default TagComponent

