import { CommunityType } from './community'
import { PostData } from './post'
import { UserResponseType } from './user'

export type SearchType = {
    communities?: CommunityType[]
    posts?: PostData[]
    users?: UserResponseType[]
}
