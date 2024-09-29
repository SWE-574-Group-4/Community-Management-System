import { CommunityFormModel } from '@/@types/community'
import ApiService from './ApiService'

export async function apiAddCommunity(data: CommunityFormModel) {
    const { is_public, userId, ...rest } = data
    return ApiService.fetchData({
        url: '/add_community/',
        method: 'post',
        data: {
            ...rest,
            is_public,
            user_id: userId,
        },
    })
}

export async function apiUpdateCommunity(data: CommunityFormModel) {
    const { cid, ...rest } = data
    return ApiService.fetchData({
        url: `/community/${cid}/`,
        method: 'put',
        data: {
            ...rest,
        },
    })
}

export async function apiGetDefaultTemplate() {
    return ApiService.fetchData({
        url: '/default_template/',
        method: 'get',
    })
}

export async function apiGetDataTypes() {
    return ApiService.fetchData({
        url: '/data_types/',
        method: 'get',
    })
}

export async function apiGetCommunityList(userId: { userId: string }) {
    return ApiService.fetchData({
        url: '/communities/',
        method: 'get',
        params: {
            user_id: userId,
        },
    })
}

export async function apiGetCommunity(id: string, userId: string) {
    return ApiService.fetchData({
        url: `/community/${id}/`,
        method: 'get',
        params: {
            user_id: userId,
        },
    })
}

export async function apiDeleteCommunity(communityId: string) {
    return ApiService.fetchData({
        url: `/community/${communityId}/`,
        method: 'delete',
    })
}

export async function apiJoinCommunity(communityId: string, userId: string) {
    return ApiService.fetchData({
        url: `/join_community/${communityId}/${userId}/`,
        method: 'post',
    })
}

export async function apiIsUserInCommunity(
    communityId: string,
    userId: string
) {
    return ApiService.fetchData({
        url: `/is_user_in_community/${communityId}/${userId}/`,
        method: 'get',
    })
}

export async function apiLeaveCommunity(communityId: string, userId: string) {
    return ApiService.fetchData({
        url: `/leave_community/${communityId}/${userId}/`,
        method: 'post',
    })
}

export async function apiFetchMembers(communityId: string) {
    return ApiService.fetchData({
        url: `/community/${communityId}/members`,
        method: 'get',
    })
}

export async function apiFetchNonMembers(communityId: string, query: string) {
    return ApiService.fetchData({
        url: `/community/${communityId}/non_members`,
        method: 'get',
        params: {
            query,
        },
    })
}

export async function apiSendInvitation(communityId: string, userId: string) {
    return ApiService.fetchData({
        url: `/community/${communityId}/invites/${userId}/`,
        method: 'post',
    })
}

export async function apiChangeUserRole(
    communityId: string,
    userId: string,
    role: number
) {
    return ApiService.fetchData({
        url: `/change_user_role/${communityId}/${userId}/`,
        method: 'post',
        data: {
            role,
        },
    })
}

export async function apiGetUserRole(communityId: string, userId: string) {
    return ApiService.fetchData({
        url: `/community/${communityId}/role/`,
        method: 'get',
        params: {
            user_id: userId,
        },
    })
}

export async function apiGetJoinRequests(communityId: string) {
    return ApiService.fetchData({
        url: `/community/${communityId}/join_requests/`,
        method: 'get',
    })
}

export async function apiAcceptRejectRequest(
    requestId: string,
    status: number
) {
    return ApiService.fetchData({
        url: `/community/${requestId}/accept_reject_join_request/`,
        method: 'post',
        data: {
            action: status,
        },
    })
}

export async function apiGetCommunityTemplates(communityId: string) {
    return ApiService.fetchData({
        url: `/community/${communityId}/templates/`,
        method: 'get',
    })
}

export async function apiAddTemplate(data: any) {
    return ApiService.fetchData({
        url: `/community/${data.communityId}/add_template/`,
        method: 'post',
        data: {
            name: data.templateName,
            description: data.templateDescription,
            fields: data.fields,
        },
    })
}

export async function apiTransferOwnership(data: any) {
    console.log('data', data)
    const { community_id, user_id, new_owner_id } = data
    return ApiService.fetchData({
        url: `/community/${community_id}/transfer_ownership/${user_id}/${new_owner_id}`,
        method: 'post',
    })
}
