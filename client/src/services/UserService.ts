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
            // dob: dob ? dayjs(dob).format('YYYY-MM-DDTHH:mm:ss') : null,
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

export async function apiGetBadges(userId: string) {
    return ApiService.fetchData({
        url: `/user/${userId}/badges/`,
        method: 'get',
        params: {
            user_id: userId,
        },
    })
}

export async function apiGetNotifications(userId: string) {
    return ApiService.fetchData({
        url: `/user/notifications/`,
        method: 'get',
        params: {
            user_id: userId,
        },
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

export async function followUser(userId: number, authedUserId: number) {
        const response = await ApiService.fetchData({
            url: `follow/${userId}/${authedUserId}`,
            method: 'post',
            data: {
                user_id: userId,
            },
        });
        return response.data;
}

export async function unfollowUser(userId: number, authedUserId: number) {
        const response = await ApiService.fetchData({
            url: `unfollow/${userId}/${authedUserId}`, 
            method: 'post',

        });
        return response.data;
}

export async function isFollowing(userId: number, authedUserId: number) {
    return ApiService.fetchData({
        url: `is_following/${userId}/${authedUserId}`,
        method: 'get',
    });

}
export async function getFollowers(userId: number) {
    return ApiService.fetchData({
        url: `followers/${userId}`,  // Pass the userId directly in the URL
        method: 'get',
    });
}

export async function getFollowing(userId: number) {
    return ApiService.fetchData({
        url: `following/${userId}`,
        method: 'get',
    });
}
// TODO: Implement the following functions
export async function getInterests(userId: number) {
    const response = await ApiService.fetchData({
        url: `/interests/${userId}/`,
        method: 'get',
    });
    return response.data;
}

export async function addInterest(userId: number, qid: string, label: string) {
    const response = await ApiService.fetchData({
        url: `/interests/${userId}/`,
        method: 'post',
        data: {
            qid,
            label,
        },
    });
    return response.data;
}

export async function deleteInterest(userId: number, qid: string) {
    const response = await ApiService.fetchData({
        url: `/interests/${userId}/`,
        method: 'delete',
        data: {
            qid,
        },
    });
    return response.data;
}

export async function getTags() {
    const response = await ApiService.fetchData({
        url: `/tags/`,
        method: 'get',
    });
    return response.data;
}

export async function triggerRelatedEntitiesFetching(qid: string) {
    const response = await ApiService.fetchData({
        url: `/fetch-related/${qid}/user_interest/`,
        method: 'get',
    });
    return response.data;
}


export async function getUserRecommendations(userId: number) {
    const response = await ApiService.fetchData({
        url: `/api/recommendations/`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            user_id: userId,
        },
    });
    return response.data;
}

export async function getUserRecommendedCommunities(userId: string) {
    const response = await ApiService.fetchData({
        url: `/user/communities/`,
        method: 'get',
        params: {
            user_id: userId,
        },
    });
    return response.data;
}