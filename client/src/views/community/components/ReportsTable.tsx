import { useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import type { ColumnDef } from '@/components/shared/DataTable';
import { Report } from '@/@types/reports';
import { Button, Notification, toast } from '@/components/ui';
import ActionLink from '@/components/shared/ActionLink';
import { formatDate } from '@/utils/helpers';
import { apiGetReportDetail, apiDeleteReport } from '@/services/ReportService';

const STATUS_LABELS = {
    0: { label: 'Pending', color: 'text-yellow-500' },
    1: { label: 'In Review', color: 'text-blue-500' },
    2: { label: 'Resolved', color: 'text-green-500' },
};

const ReportsTable = ({ reports }: { reports: Report[] }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const columns: ColumnDef<any>[] = [
        {
            header: 'Reported by',
            accessorKey: 'user',
            cell: (props) => {
                const row = props.row.original;
                return row.user && row.user.username ? (
                    <ActionLink to={`/profile/${row.user.id}`}>{row.user.username}</ActionLink>
                ) : row.user ? (
                    `User ${row.user}` // If `user` is an ID but no username
                ) : (
                    'Anonymous'
                );
            },
        },
        {
            header: 'Type',
            accessorKey: 'type',
            cell: (props) => {
                const row = props.row.original;
                return (
                    <div className="flex">
                        {row.comment ? 'Comment Report' : 'Post Report'}
                    </div>
                );
            },
        },
        {
            header: 'Reason',
            accessorKey: 'reason',
            cell: (props) => {
                const row = props.row.original;
                return <div className="flex">{row.reason}</div>;
            },
        },
        {
            header: 'Report Explanation',
            accessorKey: 'comment_text',
            cell: (props) => {
                const row = props.row.original;
                return <div className="flex">{row.comment_text || 'N/A'}</div>;
            },
        },
        {
            header: 'Post',
            accessorKey: 'post',
            cell: (props) => {
                const row = props.row.original;
                return row.post ? (
                    <ActionLink to={`/post/${row.post.id}`}>View Post</ActionLink>
                ) : (
                    'N/A'
                );
            },
        },
        {
            header: 'Comment',
            accessorKey: 'comment',
            cell: (props) => {
                const row = props.row.original;
                return row.comment && row.comment.content ? (
                    <div className="flex">{row.comment.content}</div>
                ) : (
                    'N/A'
                );
            },
        },
        {
            header: 'Reported User',
            accessorKey: 'comment_user',
            cell: (props) => {
                const row = props.row.original;
                return row.comment ? (
                    row.comment.user ? (
                        <ActionLink to={`/profile/${row.comment.user.id}`}>
                            {row.comment.user.username}
                        </ActionLink>
                    ) : (
                        'N/A'
                    )
                ) : row.post && row.post.user ? (
                    <ActionLink to={`/profile/${row.post.user.id}`}>
                        {row.post.user.username}
                    </ActionLink>
                ) : (
                    'N/A'
                );
            },
        },
        {
            header: 'Created At',
            accessorKey: 'created_at',
            cell: (props) => {
                const row = props.row.original;
                return row.created_at ? (
                    <div className="flex">{formatDate(row.created_at)}</div>
                ) : (
                    'N/A'
                );
            },
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (props) => {
                const row = props.row.original;
                const status = STATUS_LABELS[row.status as keyof typeof STATUS_LABELS] || { label: 'Unknown', color: 'text-gray-500' };
                return (
                    <div className={`flex ${status.color}`}>
                        {status.label}
                    </div>
                );
            },
        },
        {
            header: 'Actions',
            accessorKey: 'actions',
            cell: (props) => {
                const row = props.row.original;

                const handleReview = async () => {
                    try {
                        const response = await apiGetReportDetail(row.community, row.id);
                        console.log('Report Details:', response.data);
                        window.location.href = `/community/${row.community}/reports/${row.id}`;
                    } catch (error) {
                        console.error('Error fetching report details:', error);
                    }
                };

                const handleDelete = async () => {
                    try {
                        await apiDeleteReport(row.community, row.id);
                        toast.push(
                            <Notification title="Report Deleted" type="success" />,
                            { placement: 'top-center' }
                        );
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } catch (error: any) {
                        console.error('Error deleting report:', error);
                        toast.push(
                            <Notification title="Failed to Delete Report" type="danger" />,
                            { placement: 'top-center' }
                        );
                    }
                };

                return (
                    <div className="flex justify-between items-center">
                        <Button
                            className="bg-blue-500 text-white"
                            size="sm"
                            variant="solid"
                            onClick={handleReview}
                        >
                            Review
                        </Button>
                        <span className="mx-0.5"></span>
                        <Button
                            className="bg-red-500 text-white"
                            size="sm"
                            variant="solid"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <DataTable columns={columns} data={reports} loading={isLoading} />
        </div>
    );
};

export default ReportsTable;