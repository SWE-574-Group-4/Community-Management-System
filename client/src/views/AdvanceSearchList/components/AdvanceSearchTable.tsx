import { useEffect, useMemo, useRef } from 'react'
import Badge from '@/components/ui/Badge'
import DataTable from '@/components/shared/DataTable'
import {
    getAdvanceSearch,
    setTableData,
    useAppDispatch,
    useAppSelector,
} from '../store'
import AdvanceSearchDeleteConfirmation from './AdvanceSearchDeleteConfirmation'
import cloneDeep from 'lodash/cloneDeep'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'
import { formatDate, truncateText } from '@/utils/helpers'
import { CommunityType } from '@/@types/community'

const AdvanceSearchTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.advanceSearchList.data.tableData
    )

    const filterData = useAppSelector(
        (state) => state.advanceSearchList.data.filterData
    )

    const loading = useAppSelector(
        (state) => state.advanceSearchList.data.loading
    )

    const data = useAppSelector(
        (state) => state.advanceSearchList.data.advanceSearchList
    )

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, sort])

    useEffect(() => {
        if (tableRef) {
            tableRef.current?.resetSorting()
        }
    }, [filterData])

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total }),
        [pageIndex, pageSize, sort, query, total]
    )

    const fetchData = () => {
        dispatch(
            getAdvanceSearch({ pageIndex, pageSize, sort, query, filterData })
        )
    }

    const columns: ColumnDef<CommunityType>[] = useMemo(
        () => [
            {
                header: 'Community Name',
                accessorKey: 'name',
            },
            {
                header: 'Community Description',
                accessorKey: 'description',
                cell: (props) => {
                    const row = props.row.original
                    return <span>{truncateText(row.description, 40)}</span>
                },
            },
            {
                header: 'Number of Members',
                accessorKey: 'members',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <Badge
                            className="mr-4"
                            content={row.members.length}
                            innerClass="bg-blue-500"
                        />
                    )
                },
            },
            {
                header: 'Date Created',
                accessorKey: 'created_at',
                cell: (props) => {
                    const row = props.row.original
                    const formattedDate = formatDate(row.updated_at)
                    return <div className="flex">{formattedDate}</div>
                },
            },
            {
                header: 'Last Activity',
                accessorKey: 'updated_at',
                cell: (props) => {
                    const row = props.row.original
                    const formattedDate = formatDate(row.updated_at)
                    return <div className="flex">{formattedDate}</div>
                },
            },
        ],
        []
    )

    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        dispatch(setTableData(newTableData))
    }

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        dispatch(setTableData(newTableData))
    }

    const onSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        dispatch(setTableData(newTableData))
    }

    return (
        <>
            <DataTable
                ref={tableRef}
                columns={columns}
                data={data}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                loading={loading}
                pagingData={{
                    total: tableData.total as number,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
            />
            <AdvanceSearchDeleteConfirmation />
        </>
    )
}

export default AdvanceSearchTable
