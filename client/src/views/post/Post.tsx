import { TemplateResponse } from '@/@types/community'
import { apiGetCommunityTemplates } from '@/services/CommunityService'
import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MapTemplates from './components/MapTemplates'
import { useFetchCommunity } from '@/utils/hooks/useFetchCommunity'

export default function Post() {
    const [templates, setTemplates] = useState<TemplateResponse[]>([])
    const fetchTrigger = useAppSelector(
        (state) => state.community.community.fetchTrigger
    )

    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const templates = await apiGetCommunityTemplates(
                    String(id) ?? ''
                )
                if (templates.status === 200) {
                    setTemplates(templates.data as TemplateResponse[])
                }
                // fetch templates data
                console.log('fetching templates')
            } catch (error) {
                console.error('Error fetching templates', error)
            }
        }

        fetchTemplates()
    }, [fetchTrigger])

    const community = useFetchCommunity(id ?? '', fetchTrigger)

    return (
        <div>
            {community && (
                <div className="mb-5">
                    <h5>Community name: {community.name}</h5>
                    <p>Description: {community.description}</p>
                </div>
            )}
            Available templates for this community
            <MapTemplates templates={templates} />
        </div>
    )
}
