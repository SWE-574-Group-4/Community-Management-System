import { TemplateType } from '@/@types/community'
import { ActionLink } from '@/components/shared'
import { truncateText } from '@/utils/helpers'

export default function Template({
    template,
    checkboxList,
}: {
    template: TemplateType
    checkboxList: (string | number)[]
}) {
    console.log({ template, checkboxList })
    return (
        <div className="mb-5">
            <div className="block">
                {template?.name} - {truncateText(template?.description, 40)}{' '}
                <ActionLink
                    to={`/community/${template?.community?.id}/details`}
                >
                    {' '}
                    (@
                    {template?.community?.name}) -{' '}
                </ActionLink>
            </div>
            <div className="text-xs">
                {template?.fields?.map((field) => (
                    <div
                        key={field?.field_name}
                        className={`${
                            checkboxList.includes(field?.field_type) &&
                            'text-green-500'
                        }`}
                    >
                        <span className="font-bold">{field?.field_name}</span>-
                        <span className="italic">{field?.field_type}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
