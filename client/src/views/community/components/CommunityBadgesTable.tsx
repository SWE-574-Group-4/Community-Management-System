import { useState, useEffect } from 'react';
import { CommunityBadgeType } from '@/@types/user';
import { formatDate } from '@/utils/helpers';

const badgeIcons = [
    { value: 'trophy', label: '🏆' },
    { value: 'medal', label: '🥇' },
    { value: 'certificate', label: '📜' },
    { value: 'star', label: '⭐' },
    { value: 'shield-alt', label: '🛡️' },
    { value: 'award', label: '🏅' },
    { value: 'crown', label: '👑' },
    { value: 'ribbon', label: '🎗️' },
    { value: 'gem', label: '💎' },
    { value: 'badge', label: '🔖' },
    { value: 'rocket', label: '🚀' },
    { value: 'lightbulb', label: '💡' },
    { value: 'heart', label: '❤️' },
    { value: 'thumbs-up', label: '👍' },
    { value: 'handshake', label: '🤝' },
    { value: 'globe', label: '🌐' },
    { value: 'user', label: '👤' },
    { value: 'check-circle', label: '✅' },
    { value: 'flag', label: '🚩' },
    { value: 'leaf', label: '🍃' },
    { value: 'music', label: '🎵' },
    { value: 'smile', label: '😊' },
    { value: 'tree', label: '🌳' },
    { value: 'plane', label: '✈️' },
    { value: 'fire', label: '🔥' },
    { value: 'sun', label: '☀️' },
    { value: 'cloud', label: '☁️' },
    { value: 'rainbow', label: '🌈' },
    { value: 'anchor', label: '⚓' },
    { value: 'lock', label: '🔒' },
    { value: 'unlock', label: '🔓' },
    { value: 'clock', label: '⏰' },
    { value: 'bell', label: '🔔' },
    { value: 'pencil', label: '✏️' },
    { value: 'book', label: '📚' },
    { value: 'camera', label: '📷' },
    { value: 'tools', label: '🛠' },
    { value: 'suitcase', label: '💼' },
    { value: 'car', label: '🚗' },
    { value: 'bicycle', label: '🚲' },
    { value: 'puzzle-piece', label: '🧩' },
    { value: 'microphone', label: '🎤' },
    { value: 'telescope', label: '🔭' },
    { value: 'umbrella', label: '☂️' },
    { value: 'key', label: '🔑' },
    { value: 'diamond', label: '♦️' },
    { value: 'fish', label: '🐟' },
    { value: 'apple', label: '🍎' },
    { value: 'banana', label: '🍌' },
    { value: 'dog', label: '🐶' },
    { value: 'cat', label: '🐱' },
    { value: 'horse', label: '🐴' },
    { value: 'lion', label: '🦁' },
    { value: 'elephant', label: '🐘' },
    { value: 'dragon', label: '🐉' },
    { value: 'unicorn', label: '🦄' },
    { value: 'ghost', label: '👻' },
    { value: 'alien', label: '👽' },
    { value: 'robot', label: '🤖' },
    { value: 'cake', label: '🎂' },
    { value: 'pizza', label: '🍕' },
    { value: 'hamburger', label: '🍔' },
    { value: 'sushi', label: '🍣' },
    { value: 'icecream', label: '🍦' },
    { value: 'coffee', label: '☕' },
    { value: 'beer', label: '🍺' },
    { value: 'wine-glass', label: '🍷' },
    { value: 'champagne', label: '🍾' },
    { value: 'cheese', label: '🧀' },
    { value: 'donut', label: '🍩' },
    { value: 'cookie', label: '🍪' },
    { value: 'popcorn', label: '🍿' },
];

const BadgesTable = ({ badges }: { badges: CommunityBadgeType[] }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
            {badges.map((badge, index) => {
                const backgroundColor = badge.background_color || 'transparent';
                const isSpecialReward =
                    typeof badge.criteria === 'object' &&
                    'selected_user' in badge.criteria;
                const isAchieved = !!badge.earned_at;
                const badgeIcon =
                    badgeIcons.find((icon) => icon.value === badge.icon)?.label || '🏅';

                return (
                    <div
                        key={index}
                        className={`relative rounded-lg shadow-md text-center p-5 transition-transform transform ${
                            isAchieved ? '' : 'grayscale'
                        }`}
                        style={{
                            backgroundColor: isSpecialReward
                                ? '#fff8dc' // Light golden background for special rewards
                                : 'white',
                        }}
                    >
                        {isAchieved && (
                            <div
                                className={`absolute top-4 right-4 w-10 h-10 ${
                                    isSpecialReward
                                        ? 'bg-yellow-400 text-yellow-800'
                                        : 'bg-green-400 text-white'
                                } rounded-full flex items-center justify-center font-bold`}
                            >
                                {isSpecialReward ? '⭐' : '✓'}
                            </div>
                        )}

                        <div
                            className="mx-auto mb-4 flex items-center justify-center rounded-full"
                            style={{
                                backgroundColor,
                                width: '200px',
                                height: '200px',
                            }}
                        >
                            <span className="text-8xl">{badgeIcon}</span>
                        </div>

                        <div className="font-bold text-lg mb-2">{badge.name}</div>

                        <div className="text-sm text-gray-600 mb-4">
                            {badge.description || 'No description available'}
                        </div>

                        <div className="text-xs text-gray-500">
                            {isAchieved ? (
                                isSpecialReward ? (
                                    <span className="text-yellow-600 font-bold text-lg">
                                        Special Reward
                                    </span>
                                ) : (
                                    <span className="text-green-500 font-bold">
                                        {`Received on: ${formatDate(badge.earned_at || '')}`}
                                    </span>
                                )
                            ) : (
                                <span className="text-red-500 font-bold">
                                    Not Achieved
                                </span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BadgesTable;