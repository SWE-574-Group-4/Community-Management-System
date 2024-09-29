import { useMemo, useEffect, useState, useRef } from 'react'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef } from '@/components/shared/DataTable'
import {
    getIngredientCategories,
    getIngredients,
} from '@/services/IngredientsService'
import IngredientTableFilter from './IngredientTableFilter'
import IngredientTableSearch from './IngredientTableSearch'
import Button from '@/components/ui/Button'
import { userOwnsIngredient } from '@/services/UserService'
import { useAppSelector } from '@/store'
import Checkbox from '@/components/ui/Checkbox'
import { UserOwnsType } from '@/@types/user'

type IngredientCategory = {
    id: string
    title: string
    label: string
}

type CategoryOption = {
    id: string
    value: string
    label: string
}

const Ingredients = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const user = useAppSelector((state) => state.auth.user)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [fetchTrigger, setFetchTrigger] = useState<boolean>(false)
    const [data, setData] = useState<UserOwnsType[]>([])
    const [ingredientCategories, setIngredientCategories] = useState<
        CategoryOption[]
    >([])
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryQuery, setCategoryQuery] = useState('')

    const handleUserOwnsIngredient = async (row: UserOwnsType) => {
        const userOwnsData = {
            id: row.id,
            userId: user.id,
            userOwns: row.userOwns,
        }

        try {
            const result = await userOwnsIngredient(userOwnsData)

            if (result.status === 200) {
                // Toggle the fetchTrigger
                setFetchTrigger((prevFetchTrigger) => !prevFetchTrigger)
            }
        } catch (error) {
            console.log('error', error)
        }
    }
    const columns: ColumnDef<UserOwnsType>[] = useMemo(
        () => [
            {
                header: 'Malzeme Adı',
                accessorKey: 'title',
            },
            {
                header: 'Durum',
                accessorKey: 'action',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex">
                            <Checkbox
                                checked={!!row.userOwns}
                                onChange={() => handleUserOwnsIngredient(row)}
                            />
                        </div>
                    )
                },
            },
        ],
        []
    )

    useEffect(() => {
        console.log('fetchTrigger', fetchTrigger)
        const fetchData = async (searchQuery: string) => {
            !isLoading && setIsLoading(true)
            try {
                // get the data from the api
                const result = await getIngredients({
                    userId: user.id,
                    search: searchQuery,
                    categoryIds: categoryQuery,
                })

                // Cast the result.data to the expected structure
                const ingredientData: UserOwnsType[] = (
                    result.data as { data: UserOwnsType[] }
                ).data

                // Set state with the result
                setData(ingredientData)
            } catch (error) {
                console.log('error', error)
            } finally {
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)
            }
        }

        fetchData(searchQuery)
    }, [searchQuery, fetchTrigger, categoryQuery])

    useEffect(() => {
        console.log('categoryQuery', categoryQuery)
        const fetchIngredientCategories = async (searchQuery: string) => {
            try {
                // get the data from the api
                const result = await getIngredientCategories(searchQuery)

                // Cast the result.data to the expected structure
                const ingredientCategoriesData: IngredientCategory[] = (
                    result.data as { data: IngredientCategory[] }
                ).data

                const mapData = ingredientCategoriesData.map((item) => {
                    const { title, id } = item
                    return {
                        id,
                        label: title.toLocaleUpperCase('tr'),
                        value: title,
                    }
                })

                // Set state with the result
                setIngredientCategories(mapData)
            } catch (error) {
                console.log('error', error)
            } finally {
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)
            }
        }

        fetchIngredientCategories(searchQuery)
    }, [])

    const handleInputChange = (val: string) => {
        setIsLoading(true)
        setSearchQuery(val)
    }

    const handleClear = () => {
        setCategoryQuery('')
        setSearchQuery('')
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    return (
        <>
            <div className="md:flex items-center justify-between">
                <div className="md:flex items-center gap-4 align-middle">
                    <div className="flex">
                        <IngredientTableSearch
                            ref={inputRef}
                            onInputChange={handleInputChange}
                        />
                    </div>

                    <IngredientTableFilter
                        mealCategories={ingredientCategories}
                        categoryQuery={categoryQuery}
                        setCategoryQuery={setCategoryQuery}
                    />
                </div>
                <div className="mb-4 flex items-center">
                    <Button size="sm" onClick={handleClear}>
                        Temizle
                    </Button>
                </div>
            </div>
            <DataTable columns={columns} data={data} loading={isLoading} />
        </>
    )
}

export default Ingredients
