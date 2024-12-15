import { useState } from 'react';
import { BadgeType } from '@/@types/user';
import { formatDate } from '@/utils/helpers';

const BadgesTable = ({ badges }: { badges: BadgeType[] }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid grid-cols-3 gap-5 p-5">
            {badges.map((badge, index) => {
            // Determine background color based on tier
            let backgroundColor = '';
            switch (badge.tier) {
                case 'Bronze':
                backgroundColor = 'rgba(205, 127, 50, 0.4)';
                break;
                case 'Silver':
                backgroundColor = '#C0C0C0';
                break;
                case 'Gold':
                backgroundColor = '#FFD700';
                break;
                default:
                backgroundColor = 'transparent';
            }

            const isAchieved = !!badge.earned_at;

            return (
                <div
                key={index}
                className={`relative bg-gray-100 rounded-lg shadow-md text-center p-5 ${isAchieved ? '' : 'grayscale'}`}
                >
                {/* Green Check Mark */}
                {isAchieved && (
                    <div className="absolute top-5 right-5 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    ✓
                    </div>
                )}

                {/* Badge Icon */}
                <div
                    className="mx-auto mb-2 flex items-center justify-center rounded-full"
                    style={{ backgroundColor, width: '80px', height: '80px' }}
                >
                    <img
                    src={badge.icon}
                    alt={badge.name}
                    className="w-15 h-15 rounded-full"
                    />
                </div>

                {/* Badge Name and Tier */}
                <div className="font-bold text-lg mb-1">
                    {`${badge.name} - ${badge.tier}`}
                </div>

                {/* Badge Description */}
                <div className="text-sm text-gray-600 mb-2">
                    {badge.description || 'No description available'}
                </div>

                {/* Received Date */}
                <div className="text-xs text-gray-500">
                    {isAchieved ? (
                    <span className="text-green-500 font-bold">
                        {`Received on: ${formatDate(badge.earned_at || '')}`}
                    </span>
                    ) : (
                    <span className="text-red-500 font-bold">Not Achieved</span>
                    )}
                </div>
                </div>
            );
            })}
        </div>
    );
};

export default BadgesTable;
