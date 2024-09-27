import { forwardRef } from 'react'
import Input from '@/components/ui/Input'
import { HiOutlineSearch } from 'react-icons/hi'
import debounce from 'lodash/debounce'
import type { ChangeEvent } from 'react'

type TableSearchProps = {
    onInputChange: (value: string) => void
}

const TableSearch = forwardRef<HTMLInputElement, TableSearchProps>(
    (props, ref) => {
        const { onInputChange } = props

        const debounceFn = debounce(handleDebounceFn, 500)

        function handleDebounceFn(value: string) {
            onInputChange?.(value)
        }

        const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
            debounceFn(e.target.value)
        }

        return (
            <Input
                ref={ref}
                className="max-w-md md:w-52 mb-4"
                placeholder="Search"
                prefix={<HiOutlineSearch className="text-lg" />}
                onChange={handleInputChange}
            />
        )
    }
)

TableSearch.displayName = 'TableSearch'

export default TableSearch
