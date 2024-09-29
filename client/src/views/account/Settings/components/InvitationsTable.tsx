import { useState } from 'react'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Badge, Button } from '@/components/ui'
import { toggleFetchTrigger } from '@/store'
import { formatDate } from '@/utils/helpers'
import useRequestWithNotification from '@/utils/hooks/useRequestWithNotification'
import { useDispatch } from 'react-redux'
import { InvitationsType } from '@/@types/user'
import { apiAcceptRejectInvitation } from '@/services/UserService'
import { ActionLink } from '@/components/shared'

const InvitationsTable = ({
    invitations,
}: {
    invitations: InvitationsType[]
}) => {
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
            header: 'Community Name',
            accessorKey: 'community_name',
            cell: (props) => {
                const row = props.row.original
                return (
                    <ActionLink to={`/community/${row.community}/details`}>
                        {row.community_name}
                    </ActionLink>
                )
            },
        },
        {
            header: 'Invitation Date',
            accessorKey: 'created_at',
            cell: (props) => {
                const row = props.row.original
                const formattedDate = formatDate(row.created_at)
                return <div className="flex">{formattedDate}</div>
            },
        },
        {
            header: 'Actions',
            accessorKey: 'actions',
            cell: (props) => {
                const row = props.row.original

                const { id, status } = row

                if (status === 0) {
                    return (
                        <div>
                            <Button
                                size="sm"
                                variant="solid"
                                onClick={() => {
                                    if (
                                        typeof handleAcceptReject === 'function'
                                    ) {
                                        handleAcceptReject(id, 1)
                                    }
                                }}
                                className="bg-green-960 text-white mr-2"
                            >
                                Accept
                            </Button>
                            <Button
                                className="bg-red-500 text-white"
                                size="sm"
                                variant="solid"
                                onClick={() => {
                                    if (
                                        typeof handleAcceptReject === 'function'
                                    ) {
                                        handleAcceptReject(id, -1)
                                    }
                                }}
                            >
                                Decline
                            </Button>
                        </div>
                    )
                } else if (status === 1) {
                    return (
                        <div>
                            <Badge
                                className="mr-4"
                                content={'Accepted'}
                                innerClass="bg-emerald-500"
                            />
                            <br />
                            <span>
                                {formatDate(row.updated_at, 'MMMM DD, YYYY')}
                            </span>
                        </div>
                    )
                } else {
                    return (
                        <div>
                            <Badge
                                className="mr-4"
                                content={'Rejected'}
                                innerClass="bg-red-500 text-red-50"
                            />
                            <br />
                            <span>
                                {formatDate(row.updated_at, 'MMMM DD, YYYY')}
                            </span>
                        </div>
                    )
                }
            },
        },
    ]

    return (
        <div>
            <DataTable
                columns={columns}
                data={invitations}
                loading={isLoading}
            />
        </div>
    )
}

export default InvitationsTable
