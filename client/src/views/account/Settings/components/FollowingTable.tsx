// components/FollowersTable.tsx
import { useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import type { ColumnDef } from '@/components/shared/DataTable';

const FollowingsTable = ({
    followings,
}: {
    followings: { following: string}[];
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const columns: ColumnDef<any>[] = [
        {
            header: 'Followings',
            accessorKey: 'following',
            cell: (props) => {
                const row = props.row.original;
                return (
                    <div>
                        <a href={`/profile/${row.following_id}`} rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
                            {row.following}
                        </a>
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <DataTable columns={columns} data={followings} loading={isLoading} />
        </div>
    );
};

export default FollowingsTable;
