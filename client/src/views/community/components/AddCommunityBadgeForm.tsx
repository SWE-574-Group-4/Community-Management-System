import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Formik, Form, Field } from 'formik';
import { FormContainer, FormItem } from '@/components/ui/Form';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import useRequestWithNotification from '@/utils/hooks/useRequestWithNotification';
import { apiSetCommunityBadge } from '@/services/BadgeService';
import { useParams } from 'react-router-dom';
import { Alert, Select } from '@/components/ui';
import { apiFetchMembers } from '@/services/CommunityService';
import { Member } from '@/@types/community';

const criteriaOptions = [
    { value: 'posts_count', label: 'Post Count' },
    { value: 'comments_count', label: 'Comment Count' },
    { value: 'single_post_comments', label: 'Single Post Comment' },
    { value: 'single_post_likes', label: 'Single Post Like' },
    { value: 'likes_given', label: 'Likes Given' },
    { value: 'membership_duration_days', label: 'Membership Duration' },
    { value: 'selected_user', label: 'Select User' },
];

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

export default function AddCommunityBadgeForm() {
    const [badgeName, setBadgeName] = useState('');
    const [badgeDescription, setBadgeDescription] = useState('');
    const [badgeCriteria, setBadgeCriteria] = useState('');
    const [criteriaValue, setCriteriaValue] = useState('');
    const [selectedImage, setSelectedImage] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('');
    const communityId = useParams<{ id: string }>().id || '';
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [members, setMembers] = useState<Member[]>([]);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Please enter a name'),
        description: Yup.string().required('Please enter a description'),
        criteria: Yup.string().required('Please select a criteria'),
        criteriaValue: Yup.string().required(
            'Please enter a value for the selected criteria'
        ),
    });

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await apiFetchMembers(communityId);
                if (response.status === 200) {
                    setMembers(response.data as Member[]);
                    console.log('Members fetched successfully');
                }
            } catch (error) {
                console.error('Error fetching members', error);
            }
        };
    
        if (badgeCriteria === 'selected_user') {
            fetchMembers();
        }
    }, [badgeCriteria, communityId]);
    
    const handleCreateBadge = async () => {
        const criteria = {
            [badgeCriteria]: Number(criteriaValue),
        };
        await apiSetCommunityBadge({
            badgeName,
            badgeDescription,
            badgeCriteria: JSON.stringify(criteria),
            communityId,
            icon: selectedImage,
            backgroundColor,
        });
        
    };

    return (
        <div className="min-h-fit">
            <Formik
                initialValues={{}}
                validationSchema={validationSchema}
                onSubmit={() => {}}
            >
                {({}) => (
                    <Form className="mb-3">
                        <FormContainer>
                            <FormItem label={'Badge Name'} className="my-5">
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="badgeName"
                                    placeholder={'Badge Name'}
                                    component={Input}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBadgeName(e.target.value)}
                                    value={badgeName}
                                />
                            </FormItem>

                            <FormItem label={'Badge Description'} className="my-5">
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="badgeDescription"
                                    placeholder={'Badge Description'}
                                    component={Input}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBadgeDescription(e.target.value)}
                                    value={badgeDescription}
                                />
                            </FormItem>

                            <FormItem label={'Badge Criteria'} className="my-5">
                                <Select
                                    options={criteriaOptions}
                                    onChange={(selectedOption) => {
                                        if (selectedOption) {
                                            setBadgeCriteria(selectedOption.value);
                                        }
                                        setCriteriaValue('');
                                    }}
                                    value={criteriaOptions.find(
                                        (option) => option.value === badgeCriteria
                                    )}
                                />
                            </FormItem>

                            {badgeCriteria && (
                                <FormItem
                                    label={`Enter ${badgeCriteria.replace('_', ' ')}`}
                                    className="my-5"
                                >
                                    {badgeCriteria === 'selected_user' ? (
                                        <Select
                                            options={members.map((member) => ({
                                                value: member.id,
                                                label: member.username,
                                            }))}
                                            onChange={(selectedOption) => {
                                                const selectedValue = selectedOption ? selectedOption.value : '';
                                                setCriteriaValue(JSON.stringify(selectedValue));
                                            }}
                                            value={members
                                                .map((member) => ({
                                                    value: member.id,
                                                    label: member.username,
                                                }))
                                                .find((option) => JSON.parse(criteriaValue || '""') === option.value)}
                                        />
                                    ) : (
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="criteriaValue"
                                            placeholder={`Enter ${badgeCriteria.replace('_', ' ')}`}
                                            component={Input}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCriteriaValue(e.target.value)}
                                            value={criteriaValue}
                                        />
                                    )}
                                </FormItem>
                            )}

                            <FormItem label={'Select Badge Icon'} className="my-5">
                                <div className="relative text-2xl">
                                    <button
                                        type="button"
                                        className="w-full p-4 border rounded text-center"
                                        onClick={() => setDropdownVisible(!dropdownVisible)}
                                    >
                                        <div
                                            className="inline-block p-4 rounded-full"
                                            style={{ backgroundColor }}
                                        >
                                            <div className="text-4xl">
                                                {selectedImage
                                                    ? badgeIcons.find((icon) => icon.value === selectedImage)?.label
                                                    : 'Click to Select Icon'}
                                            </div>
                                        </div>
                                    </button>
                                    {dropdownVisible && (
                                        <div className="absolute z-10 bg-white border rounded shadow-md w-full mt-2 max-h-60 overflow-auto">
                                            <div className="grid grid-cols-12 gap-1">
                                                {badgeIcons.map((icon) => (
                                                    <div
                                                        key={icon.value}
                                                        className={`icon-item border rounded-full cursor-pointer flex items-center justify-center p-2 ${
                                                            selectedImage === icon.value
                                                                ? 'border-blue-500'
                                                                : ''
                                                        }`}
                                                        onClick={() => {
                                                            setSelectedImage(icon.value);
                                                            setDropdownVisible(false);
                                                        }}
                                                        style={{ backgroundColor, fontSize: '1.5rem' }}
                                                    >
                                                        <div className="text-2xl">{icon.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </FormItem>

                            <FormItem label={'Select Background Color'} className="my-5">
                                <Field
                                    type="color"
                                    name="backgroundColor"
                                    placeholder={'Select Background Color'}
                                    component={Input}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBackgroundColor(e.target.value)}
                                    value={backgroundColor}
                                />
                            </FormItem>


                            <Button
                                block
                                variant="solid"
                                type="submit"
                                color="green-600"
                                className="mt-5 font-bold text-lg"
                                onClick={handleCreateBadge}
                            >
                                Create Badge
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
