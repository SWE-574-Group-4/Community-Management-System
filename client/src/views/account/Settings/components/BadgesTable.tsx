import { useState } from 'react';
import { BadgeType } from '@/@types/user';
import { formatDate } from '@/utils/helpers';

const BadgesTable = ({ badges }: { badges: BadgeType[] }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div
            style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)', // 3 badges per row
            gap: '20px', // Space between badges
            padding: '20px',
            }}
        >
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
                style={{
                    position: 'relative',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    padding: '20px',
                    filter: isAchieved ? 'none' : 'grayscale(100%)',
                }}
                >
                {/* Green Check Mark */}
                {isAchieved && (
                    <div
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'green',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                    }}
                    >
                    ✓
                    </div>
                )}

                {/* Badge Icon */}
                <div
                    style={{
                    backgroundColor,
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    }}
                >
                    <img
                    src={badge.icon}
                    alt={badge.name}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                    }}
                    />
                </div>

                {/* Badge Name and Tier */}
                <div
                    style={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    marginBottom: '5px',
                    }}
                >
                    {`${badge.name} - ${badge.tier}`}
                </div>

                {/* Badge Description */}
                <div
                    style={{
                    fontSize: '14px',
                    color: '#555',
                    marginBottom: '10px',
                    }}
                >
                    {badge.description || 'No description available'}
                </div>

                {/* Received Date */}
                <div
                    style={{
                    fontSize: '12px',
                    color: '#777',
                    }}
                >
                    {isAchieved ? (
                    <span style={{ color: 'green', fontWeight: 'bold' }}>
                        {`Received on: ${formatDate(badge.earned_at || '')}`}
                    </span>
                    ) : (
                    <span style={{ color: 'red', fontWeight: 'bold', filter: 'none' }}>Not Achieved</span>
                    )}
                </div>
                </div>
            );
            })}
        </div>
    );
};

export default BadgesTable;
