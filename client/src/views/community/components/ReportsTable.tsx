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
            header: 'ID',
            accessorKey: 'id',
            cell: (props) => {
                const row = props.row.original;
                return row.id 
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
            header: 'Status',
            accessorKey: 'status',
            cell: (props) => {
                const row = props.row.original;
                const status = STATUS_LABELS[row.status as keyof typeof STATUS_LABELS] || { label: 'Unknown', color: 'text-gray-500' };
                return (
                    <div className={`flex ${status.color} font-bold`}>
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
                    <div className="flex items-center">
                        <Button
                            className="bg-blue-500 text-white"
                            size="sm"
                            variant="solid"
                            onClick={handleReview}
                        >
                            Review
                        </Button>
                        <span className="mx-5"></span>
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