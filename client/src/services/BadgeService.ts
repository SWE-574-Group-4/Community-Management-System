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

interface CommunityBadgeParams {
    badgeName: string
    badgeDescription: string
    badgeCriteria: string
    communityId: string
    icon: string
    backgroundColor: string
}

export async function apiSetCommunityBadge({badgeName, badgeDescription, badgeCriteria, communityId, icon, backgroundColor}: CommunityBadgeParams) {
    return ApiService.fetchData({
        url: `/community/${communityId}/setCommunityBadges/`,
        method: 'post',
        data: {
            name: badgeName,
            description: badgeDescription,
            criteria: badgeCriteria, // Ensure criteria is sent correctly
            icon, // Include icon in the request data
            background_color: backgroundColor,
        },
    })
}
