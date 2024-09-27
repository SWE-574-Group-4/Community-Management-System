import { PostData } from '@/@types/post'
import { ActionLink } from '@/components/shared'
import { truncateText } from '@/utils/helpers'

export default function Post({ post }: { post: PostData }) {
    return (
        <ActionLink to={`/post/${post.id}`}>
            {post.content && (
                <>
                    {post.content[0].field_value} -{' '}
                    {truncateText(post.content[1].field_value, 40)}
                </>
            )}
        </ActionLink>
    )
}
