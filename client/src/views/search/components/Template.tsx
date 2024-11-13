import { TemplateType } from '@/@types/community'
import { UserResponseType } from '@/@types/user'
import { ActionLink } from '@/components/shared'
import { truncateText } from '@/utils/helpers'

export default function Template({ template }: { template: TemplateType }) {
    console.log({ template })
    return (
        <div className="block">
            {template.name} - {truncateText(template.description, 40)}{' '}
            <ActionLink to={`/profile/${template.id}/`}>
                {' '}
                (@
                {template?.community?.name}) -{' '}
            </ActionLink>
        </div>
    )
}
