import ApiService from './ApiService'
import type { IngredientQueryType } from '@/@types/ingredient'

export async function getIngredients(data: IngredientQueryType) {
    return ApiService.fetchData({
        url: `/ingredients`,
        method: 'post',
        data,
    })
}

export async function getIngredientCategories(search: string) {
    return ApiService.fetchData({
        url: `/ingredients/categories`,
        method: 'get',
        params: {
            search, // Pass the search parameter to the backend
        },
    })
}
