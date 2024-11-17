import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui';
import { apiGetReports } from '@/services/ReportService';
import { Report } from '@/@types/reports';
import ReportsTable from './ReportsTable';

export default function Reports() {
    const [reports, setReports] = useState<Report[]>([]);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await apiGetReports(Number(id) ?? 0);
                if (response.status === 200) {
                    setReports(response.data as Report[]);
                }
                console.log('Fetching reports...');
            } catch (error) {
                console.error('Error fetching reports', error);
            }
        };

        fetchReports();
    }, [id]);

    return (
        <div className="mb-5">
            <Card
                clickable
                className="hover:shadow-lg transition duration-150 ease-in-out dark:border dark:border-gray-600 dark:border-solid"
                headerClass="p-0"
                footerBorder={false}
                headerBorder={false}
            >
                <ReportsTable reports={reports} />
            </Card>
        </div>
    );
}
