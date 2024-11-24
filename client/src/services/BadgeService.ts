import ApiService from './ApiService'

export async function apiGetUserBadges(userId: string) {
    return ApiService.fetchData({
        url: `/user/${userId}/badges/`,
        method: 'get',
    })
}

export async function apiGetBadge(badgeId: string) {
    return ApiService.fetchData({
        url: `/badge/${badgeId}/`,
        method: 'get',
    })
}

export async function apiAssignBadge(userId: string, badgeId: string) {
    return ApiService.fetchData({
        url: `/user/${userId}/badges/${badgeId}/assign/`,
        method: 'post',
    })
}
