import { CommunityType } from './community'
import { UserResponseType } from './user'

export type PostData = {
    id: number
    community: CommunityType
    content: _Field[]
    created_at: string
    updated_at: string
    username?: string
    firstname?: string
    lastname?: string
    user: UserResponseType
    likes?: number
    is_liked?: boolean
}

export type _Field = {
    field_name: string
    field_type: string
    field_value: string
}

export type CommentResponseType = {
    id: number
    post: number
    user: UserResponseType
    content: string
    created_at: string
    updated_at: string
}
