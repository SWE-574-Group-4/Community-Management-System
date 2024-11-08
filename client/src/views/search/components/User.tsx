import { UserResponseType } from '@/@types/user';
import { ActionLink } from '@/components/shared';
import { truncateText } from '@/utils/helpers';

export default function User({ user }: { user: UserResponseType }) {
    return (
        <ActionLink to={`/profile/${user.id}/`} className="block"> {/* Update the route here */}
            {user.firstname} {user.lastname} (@{user.username}) - {truncateText(user.short_bio || '', 40)}
        </ActionLink>
    );
}
