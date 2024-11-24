import { useState } from 'react'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Badge, Button } from '@/components/ui'
import { toggleFetchTrigger } from '@/store'
import { formatDate } from '@/utils/helpers'
import useRequestWithNotification from '@/utils/hooks/useRequestWithNotification'
import { useDispatch } from 'react-redux'
import { BadgeType, InvitationsType } from '@/@types/user'
import { apiAcceptRejectInvitation } from '@/services/UserService'
import { ActionLink } from '@/components/shared'

const BadgesTable = ({ badges }: { badges: BadgeType[] }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const dispatch = useDispatch()

    const [handleAcceptReject, isHandleAccepRejecting] =
        useRequestWithNotification(
            apiAcceptRejectInvitation,
            'Action taken successfully',
            'Error taking action',
            () => dispatch(toggleFetchTrigger())
        )

    const columns: ColumnDef<any>[] = [
        {
            header: 'Icon',
            accessorKey: 'icon',
            cell: (props) => {
                const row = props.row.original
                return (
                    <img
                        src={`${row?.icon}`}
                        alt={row.name}
                        width={50}
                        height={50}
                    />
                )
            },
        },
        {
            header: 'Name',
            accessorKey: 'badge_name',
            cell: (props) => {
                const row = props.row.original
                return <div>{row.name}</div>
            },
        },
        {
            header: 'Tier',
            accessorKey: 'tier',
            cell: (props) => {
                const row = props.row.original
                return <div>{row.tier}</div>
            },
        },
        {
            header: 'Description',
            accessorKey: 'badge_description',
            cell: (props) => {
                const row = props.row.original
                return <div>{row.description}</div>
            },
        },
        {
            header: 'Received Date',
            accessorKey: 'date',
            cell: (props) => {
                const row = props.row.original
                return <div>{formatDate(row.earned_at)}</div>
            },
        },
    ]

    return (
        <div>
            <DataTable columns={columns} data={badges} loading={isLoading} />
        </div>
    )
}

export default BadgesTable
