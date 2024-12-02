import React, { useState, useEffect } from 'react';
import { getInterests, addInterest, deleteInterest, getTags } from '@/services/InterestsService';
import { useAppSelector } from '@/store';

type Tag = {
    id: number;
    name: string;
};

type Interest = {
    id: number;
    tag: number;
    tag_name: string;
};

const MyInterests = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [interests, setInterests] = useState<Interest[]>([]);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]); // Selected tags for batch submission
    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const userInterests = await getInterests(user.id);
            setInterests(userInterests);

            const availableTags = await getTags();
            setTags(availableTags);
        };

        fetchData();
    }, [user.id]);

    const handleAddInterests = async () => {
        if (selectedTags.length === 0) {
            alert('Please select at least one tag to add!');
            return;
        }

        // Batch add selected tags
        for (const tag of selectedTags) {
            await addInterest(user.id, tag.id);
        }

        const updatedInterests = await getInterests(user.id);
        setInterests(updatedInterests);
        setSelectedTags([]); // Clear selection
    };

    const handleDeleteInterest = async (interestId: number) => {
        await deleteInterest(user.id, interestId);
        const updatedInterests = await getInterests(user.id);
        setInterests(updatedInterests);
    };

    const toggleTagSelection = (tag: Tag) => {
        // Toggle tag selection
        if (selectedTags.find((selectedTag) => selectedTag.id === tag.id)) {
            setSelectedTags(selectedTags.filter((selectedTag) => selectedTag.id !== tag.id));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">My Interests</h2>
            <div className="mb-6">
                <ul className="space-y-2">
                    {interests.map((interest) => (
                        <li key={interest.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                            <span>{interest.tag_name}</span>
                            <button
                                onClick={() => handleDeleteInterest(interest.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Add New Interests</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag) => (
                        <button
                            key={tag.id}
                            onClick={() => toggleTagSelection(tag)}
                            className={`px-3 py-1 rounded ${
                                selectedTags.find((selectedTag) => selectedTag.id === tag.id)
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-black hover:bg-gray-300'
                            }`}
                        >
                            {tag.name}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleAddInterests}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Add Selected Interests
                </button>
            </div>
        </div>
    );
};

export default MyInterests;
