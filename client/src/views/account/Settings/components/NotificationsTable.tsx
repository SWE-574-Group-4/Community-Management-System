import { useState } from 'react'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Badge, Button } from '@/components/ui'
import { toggleFetchTrigger } from '@/store'
import { formatDate } from '@/utils/helpers'
import useRequestWithNotification from '@/utils/hooks/useRequestWithNotification'
import { useDispatch } from 'react-redux'
import { BadgeType, InvitationsType, NotificationType } from '@/@types/user'
import { apiGetNotifications } from '@/services/UserService'
import { ActionLink } from '@/components/shared'

const NotificationsTable = ({
    notifications,
}: {
    notifications: NotificationType[]
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const dispatch = useDispatch()

    const [handleAcceptReject, isHandleAccepRejecting] =
        useRequestWithNotification(
            apiGetNotifications,
            'Action taken successfully',
            'Error taking action',
            () => dispatch(toggleFetchTrigger())
        )

    const columns: ColumnDef<any>[] = [
        {
            header: 'Message',
            accessorKey: 'message_description',
            cell: (props) => {
                const row = props.row.original
                return <div>{row.message}</div>
            },
        },
        {
            header: 'Received Date',
            accessorKey: 'notification_creation_date',
            cell: (props) => {
                const row = props.row.original
                return <div>{formatDate(row.created_at)}</div>
            },
        },
    ]

    return (
        <div>
            <DataTable
                columns={columns}
                data={notifications}
                loading={isLoading}
            />
        </div>
    )
}

export default NotificationsTable
