export type UserResponseType = {
    country: string | null
    dob?: string | null
    email: string
    firstname: string
    id: number
    lastname: string
    phone: string
    short_bio: string | null
    username: string
    is_invited?: boolean
    is_followed?: boolean

}

export type PasswordType = {
    userId: string
    newPassword: string
}

export type UserMealLikeType = {
    mealId: number
    userId: number
    isLiked: boolean
}

export type UserOwnsType = {
    id: number
    userId: number
    userOwns?: boolean
}

export type InvitationsType = {
    id: number
    community_name: string
    created_at?: string
    updated_at?: string
    status: boolean
}

export type BadgeType = {
    id: number
    name: string
    description?: string
    tier?: string
    status: boolean
}

export type NotificationType = {
    id: number
    name: string
    is_read?: boolean
    created_at?: string
}

export type ProfileType = {
    id: number
    firstname: string
    lastname: string
    username: string
    email: string
    // dob: string | null
    country: string | null
    phone: string | null
    short_bio: string | null
    posts: Post[]
    communities: Community[]
    is_followed?: boolean // Add follow status here too if needed
    followers_count?: number
    following_count?: number
}

export type Post = {
    id: number
    content: string
}

export type Community = {
    id: number
    name: string
}
