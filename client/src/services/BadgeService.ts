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

export async function apiSetCommunityBadge({
    badgeName,
    badgeDescription,
    badgeTier,
    badgeCriteria,
    communityId,
}: {
    badgeName: string
    badgeDescription: string
    badgeTier: string
    badgeCriteria: string
    communityId: string
}) {
    return ApiService.fetchData({
        url: `/community/${communityId}/setCommunityBadges/`,
        method: 'post',
        data: {
            name: badgeName,
            description: badgeDescription,
            tier: badgeTier,
            criteria: badgeCriteria,
        },
    })
}
