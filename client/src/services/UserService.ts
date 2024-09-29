import ApiService from './ApiService'
import type { PasswordType, UserResponseType } from '@/@types/user'
import dayjs from 'dayjs'

export async function getUsers() {
    return ApiService.fetchData({
        url: `/users`,
        method: 'get',
    })
}

export async function updateProfile(data: UserResponseType) {
    const { id, dob, ..._data } = data

    return ApiService.fetchData({
        url: `/users/${id}/`,
        method: 'put',
        data: {
            ..._data,
            dob: dob ? dayjs(dob).format('YYYY-MM-DDTHH:mm:ss') : null,
        },
    })
}

export async function deleteUser(userId: string) {
    return ApiService.fetchData({
        url: `/users/${userId}/`,
        method: 'delete',
    })
}

export async function updatePassword(data: PasswordType) {
    return ApiService.fetchData({
        url: `/update-password`,
        method: 'put',
        data,
    })
}

export async function apiGetInvitations(userId: string) {
    return ApiService.fetchData({
        url: `/user/${userId}/invitations/`,
        method: 'get',
    })
}

export async function apiGetUserCommunities(userId: string) {
    return ApiService.fetchData({
        url: `/user/communities/`,
        method: 'get',
        params: {
            user_id: userId,
        },
    })
}

export async function apiAcceptRejectInvitation(
    invitationId: string,
    status: number
) {
    return ApiService.fetchData({
        url: `/user/${invitationId}/accept_reject_invitation/`,
        method: 'post',
        data: {
            action: status,
        },
    })
}

export async function apiGetUserInformation(userId: string) {
    return ApiService.fetchData({
        url: `/users/${userId}/`,
        method: 'get',
    })
}
