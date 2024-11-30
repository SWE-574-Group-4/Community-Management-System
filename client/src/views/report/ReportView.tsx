import { Report } from '@/@types/reports';
import { apiGetReportDetail, apiDeleteReport, apiUpdateReportStatus } from '@/services/ReportService';
import { formatDate } from '@/utils/helpers';
import useFetchData from '@/utils/hooks/useFetchData';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Select } from '@/components/ui';
import { Notification, toast } from '@/components/ui';
import { AxiosResponse } from 'axios';
import { useState } from 'react';

const STATUS_OPTIONS = [
    { value: 0, label: 'Pending' },
    { value: 1, label: 'In Review' },
    { value: 2, label: 'Resolved' },
];

export default function ReportView() {
    const { community_id: communityId, report_id: reportId } = useParams<{
        community_id: string;
        report_id: string;
    }>();

    const navigate = useNavigate();

    // Fetch report data using useFetchData
    const report = useFetchData(apiGetReportDetail, [communityId, reportId]) as AxiosResponse;

    const [selectedStatus, setSelectedStatus] = useState(report?.data?.status || 0);

    const handleDeleteReport = async () => {
        try {
            await apiDeleteReport(Number(communityId), Number(reportId));
            toast.push(
                <Notification title="Report Deleted" type="success" />,
                { placement: 'top-center' }
            );
            navigate(`/community/${communityId}/reports`);
        } catch (error: any) {
            console.error('Error deleting report:', error);
            toast.push(
                <Notification title="Failed to Delete Report" type="danger" />,
                { placement: 'top-center' }
            );
        }
    };

    const handleStatusChange = async (newStatus: number) => {
        try {
            await apiUpdateReportStatus(Number(communityId), Number(reportId), { status: newStatus });
            toast.push(
                <Notification title="Status Updated" type="success" />,
                { placement: 'top-center' }
            );
            setSelectedStatus(newStatus);
        } catch (error: any) {
            console.error('Error updating status:', error);
            toast.push(
                <Notification title="Failed to Update Status" type="danger" />,
                { placement: 'top-center' }
            );
        }
    };

    return (
        <div>
            {report?.data && (
                <Card className="min-w-[320px] md:min-w-[600px] mt-5 mx-auto">
                    <h2 className="text-xl font-bold mb-4">#{reportId} Report Details </h2>
                    <div className="mb-4">
                        <strong>Reported By:</strong>{' '}
                        {report.data.user ? (
                            <a
                                href={`/profile/${report.data.user.id}`}
                                className="text-blue-500 underline"
                            >
                                {report.data.user.username}
                            </a>
                        ) : (
                            'Anonymous'
                        )}
                    </div>
                    <div className="mb-4">
                        <strong>Report Type:</strong> {report.data.comment ? 'Comment Report' : 'Post Report'}
                    </div>
                    <div className="mb-4">
                        <strong>Reason:</strong> {report.data.reason}
                    </div>
                    <div className="mb-4">
                        <strong>Report Explanation:</strong>{' '}
                        {report.data.comment_text || 'N/A'}
                    </div>
                    <div className="mb-4">
                        <strong>Post:</strong>{' '}
                        {report.data.post ? (
                            <a
                                href={`/post/${report.data.post.id}`}
                                className="text-blue-500 underline"
                            >
                                View Post
                            </a>
                        ) : (
                            'N/A'
                        )}
                    </div>
                    {report.data.comment ? (
                        <div className="mb-4">
                            <strong>Comment:</strong>{' '}
                            {report.data.comment.content || '-'}
                        </div>
                    ) : (
                        <div className="mb-4">
                            <strong>Comment:</strong> -
                        </div>
                    )}
                    <div className="mb-4">
                        <strong>Reported User:</strong>{' '}
                        {report.data.comment ? (
                            report.data.comment.user ? (
                                <a
                                    href={`/profile/${report.data.comment.user.id}`}
                                    className="text-blue-500 underline"
                                >
                                    {report.data.comment.user.username}
                                </a>
                            ) : (
                                'N/A'
                            )
                        ) : report.data.post && report.data.post.user ? (
                            <a
                                href={`/profile/${report.data.post.user.id}`}
                                className="text-blue-500 underline"
                            >
                                {report.data.post.user.username}
                            </a>
                        ) : (
                            'N/A'
                        )}
                    </div>
                    <div className="mb-4">
                        <strong>Reported On:</strong> {formatDate(report.data.created_at)}
                    </div>
                    <div className="mb-4">
                        <strong>Status:</strong>
                        <Select
                            options={STATUS_OPTIONS}
                            placeholder="Select Status"
                            className="ml-2 max-w-md md:w-52"
                            value={STATUS_OPTIONS.find((option) => option.value === selectedStatus) || null}
                            onChange={(selectedOption) => {
                                if (selectedOption) {
                                    const status = selectedOption.value; // Extract the value from the selected option
                                    handleStatusChange(status); // Call your function to handle status change
                                }
                            }}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button
                            className="bg-red-500 mx-2"
                            onClick={handleDeleteReport}
                        >
                            Delete Report
                        </Button>
                        <Button
                            className="bg-gray-500"
                            onClick={() => navigate(`/community/${communityId}/reports`)}
                        >
                            Back to Community
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
}