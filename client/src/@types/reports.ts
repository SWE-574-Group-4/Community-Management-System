import { CommunityType } from './community'
import { UserResponseType } from './user'
import { PostData } from './post'
import { CommentResponseType } from './post'

export interface Report {
    id: number;
    user: UserResponseType;
    post: PostData;
    comment: CommentResponseType;
    community: CommunityType;
    reason: string;
    comment_text: string;
    created_at: string;
    status: number;
}
