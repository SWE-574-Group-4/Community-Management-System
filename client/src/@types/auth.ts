import { UserResponseType } from './user'

export type SignInCredential = {
    username: string
    password: string
}

export type SignInResponse = {
    token: string
    user: UserResponseType
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    firstname: string // Required
    lastname: string // Required
    username: string // Required
    password: string // Required
    email?: string
    dob?: string
    country?: string
    phone?: string
    short_bio?: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}
