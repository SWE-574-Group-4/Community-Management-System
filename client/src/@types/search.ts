import { CommunityType } from './community'
import { PostData } from './post'

export type SearchType = {
    communities?: CommunityType[]
    posts?: PostData[]
}
