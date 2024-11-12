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
                const iconUrl = row.icon ? `${row.icon}` : null
                return iconUrl ? (
                    <img
                        src={iconUrl}
                        alt={row.name}
                        style={{ width: '50px', height: '50px' }}
                    />
                ) : null
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
            header: 'Description',
            accessorKey: 'badge_description',
            cell: (props) => {
                const row = props.row.original
                return <div>{row.description}</div>
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
            header: 'Date',
            accessorKey: 'date',
            cell: (props) => {
                const row = props.row.original
                return <div>{row.earned_at}</div>
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
