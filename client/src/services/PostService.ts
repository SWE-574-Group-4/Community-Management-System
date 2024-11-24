import ApiService from './ApiService'

export async function apiPost(
    communityId: string,
    userId: string,
    fields: string,
    tag_ids: number[]
) {
    return ApiService.fetchData({
        url: `/post/`,
        method: 'post',

        // TODO: remove headers
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            community_id: communityId,
            user_id: userId,
            content: fields,
            tag_ids: tag_ids, // TODO: Look for a better way to process in the backend like content fields
        },
    })
}

export async function apiGetPosts(userId?: string) {
    return ApiService.fetchData({
        url: `/posts/`,
        method: 'get',
        params: {
            user_id: userId,
        },
    })
}

export async function apiGetCommunityPosts(communityId: string) {
    return ApiService.fetchData({
        url: `/community/${communityId}/posts/`,
        method: 'get',
    })
}

export async function apiGetPost(postId: string, userId?: string) {
    return ApiService.fetchData({
        url: `/post/${postId}/`,
        method: 'post',
        data: {
            user_id: userId,
        },
    })
}

export async function apiDeletePost(postId: string) {
    return ApiService.fetchData({
        url: `/post/${postId}/delete/`,
        method: 'delete',
    })
}

export async function apiLikePost(userId: string, postId: string) {
    return ApiService.fetchData({
        url: `/user/${userId}/likes/${postId}`,
        method: 'post',
    })
}

// comments
export async function apiGetComments(postId: string) {
    return ApiService.fetchData({
        url: `/post/${postId}/comments`,
        method: 'get',
    })
}

export async function apiPostComment(
    postId: string,
    userId: string,
    content: string
) {
    return ApiService.fetchData({
        url: `/post/${postId}/comment/`,
        method: 'post',
        data: {
            user_id: userId,
            content,
        },
    })
}

export async function apiRemoveComment(commentId: string) {
    return ApiService.fetchData({
        url: `/comment/${commentId}/remove`,
        method: 'delete',
    })
}

// tags
export async function apiGetTags() {
    return ApiService.fetchData({
        url: `/tags/`,
        method: 'get',
    })
}
