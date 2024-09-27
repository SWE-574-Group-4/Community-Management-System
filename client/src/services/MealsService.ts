import ApiService from './ApiService'

type UserMealQueryType = {
    userId: number
    search: string
    categoryId: string
}

export async function getMeals(data: UserMealQueryType) {
    return ApiService.fetchData({
        url: `/meals`,
        method: 'post',
        data,
    })
}

export async function getMealCategories(search: string) {
    return ApiService.fetchData({
        url: `/meals/categories`,
        method: 'get',
        params: {
            search, // Pass the search parameter to the backend
        },
    })
}
