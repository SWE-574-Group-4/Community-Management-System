import { Card } from '@/components/ui'
import { TemplateType } from '@/@types/community'
import MapField from './MapField'

export default function Template({ template }: { template: TemplateType }) {
    return (
        <Card bordered className="mt-5">
            <div className="text-gray font-bold">{template.name}:</div>
            <MapField fields={template.fields} />
        </Card>
    )
}
