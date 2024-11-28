import { Card, Button } from '@/components/ui'
import { TemplateType } from '@/@types/community'
import MapField from './MapField'
import useRequestWithNotification from '@/utils/hooks/useRequestWithNotification'
import { apiDeleteTemplate } from '@/services/CommunityService'
import { useDispatch } from 'react-redux'
import { toggleFetchTrigger } from '@/store'

export default function Template({ template }: { template: TemplateType }) {
    const dispatch = useDispatch()
    const [handleDelete, isDeleting] = useRequestWithNotification(
        apiDeleteTemplate,
        'Action successful!',
        'Action failed!',
        () => dispatch(toggleFetchTrigger())
    )

    return (
        <Card bordered className="mt-5">
            <div className="text-gray font-bold">{template.name}:</div>
            <MapField fields={template.fields} />
            <div className="add-template self-end mt-2">
                {template?.name !== 'Default Template' &&
                    typeof handleDelete === 'function' && (
                        <Button
                            onClick={() => {
                                handleDelete(template?.id)
                            }}
                        >
                            Delete
                        </Button>
                    )}
            </div>
        </Card>
    )
}
