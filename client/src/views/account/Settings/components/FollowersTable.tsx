// components/FollowersTable.tsx
import { useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import type { ColumnDef } from '@/components/shared/DataTable';

const FollowersTable = ({
    followers,
}: {
    followers: { follower: string}[];
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const columns: ColumnDef<any>[] = [
        {
            header: 'Followers',
            accessorKey: 'follower',
            cell: (props) => {
                const row = props.row.original;
                return (
                    <div>
                        <a href={`/profile/${row.follower_id}`} rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
                            {row.follower}
                        </a>
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <DataTable columns={columns} data={followers} loading={isLoading} />
        </div>
    );
};

export default FollowersTable;
