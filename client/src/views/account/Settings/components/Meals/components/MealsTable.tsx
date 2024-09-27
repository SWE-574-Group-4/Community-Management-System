import { useMemo, useEffect, useState, useRef } from 'react'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef } from '@/components/shared/DataTable'
import { getMealCategories, getMeals } from '@/services/MealsService'
import { Meal } from '@/@types/meals'
import { BsHandThumbsUp, BsHandThumbsUpFill } from 'react-icons/bs'
import MealTableFilter from './MealTableFilter'
import MealTableSearch from './MealTableSearch'
import Button from '@/components/ui/Button'
import { userMealLike } from '@/services/UserService'
import { useAppSelector } from '@/store'

type MealCategory = {
    id: string
    title: string
}

type CategoryOption = {
    value: string
    label: string
    id: string
}

const Meals = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const user = useAppSelector((state) => state.auth.user)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [fetchTrigger, setFetchTrigger] = useState<boolean>(false)
    const [data, setData] = useState<Meal[]>([])
    const [mealCategories, setMealCategories] = useState<CategoryOption[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryQuery, setCategoryQuery] = useState('')

    const handleMealLike = async (row: Meal) => {
        const mealLikeData = {
            mealId: row.id,
            userId: user.id,
            isLiked: !!row.isLiked,
        }

        try {
            const result = await userMealLike(mealLikeData)

            if (result.status === 200) {
                // Toggle the fetchTrigger
                setFetchTrigger((prevFetchTrigger) => !prevFetchTrigger)
            }
        } catch (error) {
            console.log('error', error)
        }
    }
    const columns: ColumnDef<Meal>[] = useMemo(
        () => [
            {
                header: 'Yemek Adı',
                accessorKey: 'title',
            },
            {
                header: 'İşlem',
                accessorKey: 'action',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex -ml-3">
                            <div
                                className="header-action-item header-action-item-hoverable"
                                onClick={() => handleMealLike(row)}
                            >
                                {row.isLiked ? (
                                    <BsHandThumbsUpFill />
                                ) : (
                                    <BsHandThumbsUp />
                                )}
                            </div>
                        </div>
                    )
                },
            },
        ],
        []
    )

    useEffect(() => {
        const fetchData = async (searchQuery: string) => {
            !isLoading && setIsLoading(true)
            try {
                // get the data from the api
                const result = await getMeals({
                    userId: user.id,
                    search: searchQuery,
                    categoryId: categoryQuery,
                })

                // Cast the result.data to the expected structure
                const mealData: Meal[] = (result.data as { data: Meal[] }).data

                // Set state with the result
                setData(mealData)
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
        const fetchMealCategories = async (searchQuery: string) => {
            try {
                // get the data from the api
                const result = await getMealCategories(searchQuery)

                // Cast the result.data to the expected structure
                const mealCategoriesData: MealCategory[] = (
                    result.data as { data: MealCategory[] }
                ).data

                const mapData = mealCategoriesData.map((item) => {
                    const { title, id } = item
                    return {
                        id,
                        label: title.toLocaleUpperCase('tr'),
                        value: title,
                    }
                })

                // Set state with the result
                setMealCategories(mapData)
            } catch (error) {
                console.log('error', error)
            } finally {
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)
            }
        }

        fetchMealCategories(searchQuery)
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
                        <MealTableSearch
                            ref={inputRef}
                            onInputChange={handleInputChange}
                        />
                    </div>

                    <MealTableFilter
                        mealCategories={mealCategories}
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

export default Meals
