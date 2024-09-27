import { useRef } from 'react'
import Button from '@/components/ui/Button'
import IngredientTableSearch from './IngredientTableSearch'
import IngredientTableFilter from './IngredientTableFilter'
import cloneDeep from 'lodash/cloneDeep'
import type { TableQueries } from '@/@types/common'
import { useAppDispatch, useAppSelector } from '@/store'

const MealsTableTools = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    // const tableData = useAppSelector((state) => state.crmMeals.data.tableData)

    const handleInputChange = (val: string) => {
        console.log('val', val)
        return
    }

    // const fetchData = (data: TableQueries) => {
    //     dispatch(setTableData(data))
    //     dispatch(getMeals(data))
    // }

    // const onClearAll = () => {
    //     const newTableData = cloneDeep(tableData)
    //     newTableData.query = ''
    //     if (inputRef.current) {
    //         inputRef.current.value = ''
    //     }
    //     dispatch(setFilterData({ status: '' }))
    //     fetchData(newTableData)
    // }

    return (
        <div className="md:flex items-center justify-between">
            <div className="md:flex items-center gap-4">
                <IngredientTableSearch
                    ref={inputRef}
                    onInputChange={handleInputChange}
                />
                {/* <IngredientTableFilter /> */}
            </div>
            <div className="mb-4">
                <Button size="sm">Clear All</Button>
            </div>
        </div>
    )
}

export default MealsTableTools
