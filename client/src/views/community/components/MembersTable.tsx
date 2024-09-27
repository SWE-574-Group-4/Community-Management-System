import { useMemo, useState } from 'react'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef } from '@/components/shared/DataTable'
import columns from './MembersTableColumns'
import { IndividualCommunityType, Member } from '@/@types/community'

import { Button } from '@/components/ui'
import {
    apiChangeUserRole,
    apiLeaveCommunity,
    apiTransferOwnership,
} from '@/services/CommunityService'
import { toggleFetchTrigger, useAppSelector } from '@/store'
import { formatDate, mapRoleToLabel } from '@/utils/helpers'
import useRequestWithNotification from '@/utils/hooks/useRequestWithNotification'
import { useDispatch } from 'react-redux'
import { ActionLink } from '@/components/shared'

const MembersTable = ({
    members,
    community,
}: {
    members: Member[]
    community: IndividualCommunityType
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { is_owner, id } = community
    const userId = useAppSelector((state) => state.auth.user.id)

    const dispatch = useDispatch()

    const [handleChangeRole, isChangingRole] = useRequestWithNotification(
        apiChangeUserRole,
        'Role has been successfully changed!',
        'Error changing role',
        () => dispatch(toggleFetchTrigger())
    )

    const [handleLeaveCommunity, isLeaving] = useRequestWithNotification(
        apiLeaveCommunity,
        'You have successfully removed the member!',
        'Error removing member',
        () => dispatch(toggleFetchTrigger())
    )

    const [handleTransferOwnership, isTransfering] = useRequestWithNotification(
        apiTransferOwnership,
        'You have successfully transferred the ownership!',
        'Error transfering ownership!',
        () => dispatch(toggleFetchTrigger())
    )

    const columns: ColumnDef<any>[] = [
        {
            header: 'Name',
            accessorKey: 'firstname',
            cell: (props) => {
                const row = props.row.original
                return (
                    // TODO: Change the link to the user profile
                    <ActionLink to={`/profile/${row.id}`}>
                        {row.firstname} {row.lastname}
                    </ActionLink>
                )
            },
        },
        {
            header: 'Username',
            accessorKey: 'username',
        },
        {
            header: 'Email',
            accessorKey: 'email',
        },
        {
            header: 'Role',
            accessorKey: 'role',
            cell: (props) => {
                const row = props.row.original
                return <div className="flex">{mapRoleToLabel(row.role)}</div>
            },
        },
        {
            header: 'Member Since',
            accessorKey: 'joined_at',
            cell: (props) => {
                const row = props.row.original
                const formattedDate = formatDate(row.joined_at)
                return <div className="flex">{formattedDate}</div>
            },
        },
        {
            header: 'Actions',
            accessorKey: 'actions',
            cell: (props) => {
                const row = props.row.original

                if (row.role === -1) {
                    return (
                        <Button
                            disabled
                            className="bg-blue-500 text-white"
                            size="sm"
                            variant="solid"
                            onClick={() => console.log({ row })}
                        >
                            Owner
                        </Button>
                    )
                } else if (row.role === 0) {
                    return (
                        <div className="flex justify-between items-center">
                            <Button
                                // disabled={is_owner}
                                className="bg-blue-500 text-white"
                                size="sm"
                                variant="solid"
                                onClick={() => {
                                    if (
                                        typeof handleChangeRole === 'function'
                                    ) {
                                        handleChangeRole(id, row.id, 1)
                                    }
                                }}
                            >
                                Assign Moderator
                            </Button>
                            <ActionLink
                                onClick={() => {
                                    if (
                                        typeof handleLeaveCommunity ===
                                        'function'
                                    ) {
                                        handleLeaveCommunity(id, row.id, 0)
                                    }
                                }}
                            >
                                Remove
                            </ActionLink>
                        </div>
                    )
                } else
                    return (
                        <div className="flex justify-between items-center">
                            <Button
                                // disabled={is_owner}
                                onClick={() => {
                                    if (
                                        typeof handleChangeRole === 'function'
                                    ) {
                                        handleChangeRole(id, row.id, 0)
                                    }
                                }}
                            >
                                Unassign Moderator
                            </Button>
                            <Button
                                // disabled={is_owner}
                                onClick={() => {
                                    if (
                                        typeof handleTransferOwnership ===
                                        'function'
                                    ) {
                                        handleTransferOwnership({
                                            community_id: id,
                                            user_id: userId,
                                            new_owner_id: row.id,
                                        })
                                    }
                                }}
                            >
                                Transfer Ownership{' '}
                            </Button>
                            <ActionLink
                                onClick={() => {
                                    if (
                                        typeof handleLeaveCommunity ===
                                        'function'
                                    ) {
                                        handleLeaveCommunity(id, row.id, 0)
                                    }
                                }}
                            >
                                Remove
                            </ActionLink>
                        </div>
                    )
            },
        },
    ]

    const filteredColumns = columns.filter((item) => item.header !== 'Actions')

    return (
        <div>
            <DataTable
                columns={is_owner ? columns : filteredColumns}
                data={members}
                loading={isLoading}
            />
        </div>
    )
}

export default MembersTable
