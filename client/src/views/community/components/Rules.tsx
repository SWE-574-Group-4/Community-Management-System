import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui';
import { apiAddCommunity } from '@/services/CommunityService';
import { useAppSelector } from '@/store';
import { CommunityType } from '@/@types/community';



export default function Rules() {
    const [rules, setRules] = useState<CommunityType[]>([]);
    const { id } = useParams<{ id: string }>();
    const fetchTrigger = useAppSelector(
        (state) => state.community.community.fetchTrigger
    );
    const userId = useAppSelector((state) => state.auth.user?.id);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const rules = await apiAddCommunity({ userId, rules: '', name: '', description: '', is_public: false });
                if (rules.status === 200) {
                    setRules(rules.data as CommunityType[]);
                }
                // fetch rules data
                console.log('fetching rules');
            } catch (error) {
                console.error('Error fetching rules', error);
            }
        };

        fetchRules();
    }, [fetchTrigger]);

    return (
        <div className="mb-5">
            <Card
                clickable
                className="hover:shadow-lg transition duration-150 ease-in-out dark:border dark:border-gray-600 dark:border-solid"
                headerClass="p-0"
                footerBorder={false}
                headerBorder={false}
            >
                <div>
                    {rules.map((rule, index) => (
                        <div key={index}>
                            <p className="mb-2">{rule.name}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
