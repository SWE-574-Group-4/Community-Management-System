import ApiService from './ApiService'

export async function apiSearch(query: string) {
    return ApiService.fetchData({
        url: `/search/`,
        method: 'get',
        params: {
            query,
        },
    })
}

export async function apiAdvanceSearch<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/advance_search/`,
        method: 'post',
        data,
    })
}
