import { useState } from 'react'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef, Row } from '@/components/shared/DataTable'
import { apiAcceptRejectRequest } from '@/services/CommunityService'
import { toggleFetchTrigger } from '@/store'
import { formatDate, truncateText } from '@/utils/helpers'
import useRequestWithNotification from '@/utils/hooks/useRequestWithNotification'
import { useDispatch } from 'react-redux'
import { PostData } from '@/@types/post'
import { useNavigate } from 'react-router-dom'

const PostsTable = ({ posts }: { posts: PostData[] }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [handleAcceptReject, isHandleAccepRejecting] =
        useRequestWithNotification(
            apiAcceptRejectRequest,
            'Action taken successfully',
            'Error taking action',
            () => dispatch(toggleFetchTrigger())
        )

    const columns: ColumnDef<any>[] = [
        {
            header: 'Title',
            accessorKey: 'title',
            cell: (props) => {
                const row = props.row.original
                return <div className="flex">{row.content[0].field_value}</div>
            },
        },
        {
            header: 'Description',
            accessorKey: 'lastname',
            cell: (props) => {
                const row = props.row.original
                return (
                    <div className="flex">
                        {truncateText(row.content[1].field_value, 60)}
                    </div>
                )
            },
        },
        {
            header: 'Posted by',
            accessorKey: 'user',
            cell: (props) => {
                const row = props.row.original
                return (
                    <div className="flex">
                        {row.user.firstname} {row.user.lastname}
                    </div>
                )
            },
        },
        {
            header: 'Posted on',
            accessorKey: 'created_at',
            cell: (props) => {
                const row = props.row.original
                const formattedDate = formatDate(row.created_at)
                return <div className="flex">{formattedDate}</div>
            },
        },
    ]

    const handleClick = (row: any) => {
        navigate(`/post/${row.original.id}`)
    }

    return (
        <div>
            <DataTable
                columns={columns}
                data={posts}
                loading={isLoading}
                handleClick={handleClick}
            />
        </div>
    )
}

export default PostsTable
