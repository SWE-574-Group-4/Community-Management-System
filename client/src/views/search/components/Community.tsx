import { CommunityType } from '@/@types/community'
import { ActionLink } from '@/components/shared'
import { truncateText } from '@/utils/helpers'

export default function Community({ community }: { community: CommunityType }) {
    return (
        <ActionLink to={`/community/${community.id}/details`} className="block">
            {community.name} - {truncateText(community.description, 40)}
        </ActionLink>
    )
}
