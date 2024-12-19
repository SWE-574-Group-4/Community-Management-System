import React, { useState, useEffect } from 'react';
import { getInterests, addInterest, deleteInterest, triggerRelatedEntitiesFetching } from '@/services/UserService';
import { useAppSelector } from '@/store';
import axios from 'axios';

type Tag = {
    id: string; // Using string for Wikidata QID
    label: string;
    description?: string;
};

type Interest = {
    id: number;
    qid: string; // QID from Wikidata
    label: string; // Label for the interest
};

const MyInterests = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [interests, setInterests] = useState<Interest[]>([]);
    const [searchResults, setSearchResults] = useState<Tag[]>([]);
    const [query, setQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]); // Selected tags for batch submission

    useEffect(() => {
        // Fetch existing interests on load
        const fetchInterests = async () => {
            try {
                const userInterests:any = await getInterests(user.id);
                setInterests(userInterests);
            } catch (error) {
                console.error('Error fetching user interests:', error);
            }
        };

        fetchInterests();
    }, [user.id]);

    const searchTags = async () => {
        if (!query.trim()) {
            alert('Please enter a search term!');
            return;
        }

        try {
            const response = await axios.get('https://www.wikidata.org/w/api.php', {
                params: {
                    action: 'wbsearchentities',
                    search: query,
                    language: 'en',
                    format: 'json',
                    limit: 10,
                    origin: '*', // Required for cross-origin requests
                },
            });

            const results = response.data.search.map((result: any) => ({
                id: result.id, // QID
                label: result.label,
                description: result.description,
            }));

            setSearchResults(results);
        } catch (error) {
            console.error('Error searching tags:', error);
        }
    };
    const handleAddInterests = async () => {
        if (selectedTags.length === 0) {
            alert('Please select at least one tag to add!');
            return;
        }
    
        try {
            for (const tag of selectedTags) {
                // Add interest
                await addInterest(user.id, tag.id, tag.label); // Pass both QID and label
    
                // Fetch and store related entities
                try {
                    await triggerRelatedEntitiesFetching(tag.id) // Trigger related entities fetching
                } catch (fetchError) {
                    console.error(`Error fetching related entities for QID ${tag.id}:`, fetchError);
                }
            }
    
            // Update interests list
            const updatedInterests:any = await getInterests(user.id);
            setInterests(updatedInterests);
    
            // Clear selected tags
            setSelectedTags([]);
        } catch (error) {
            console.error('Error adding interests:', error);
        }
    };

    const handleRemoveInterest = async (qid: string) => {
        try {
            await deleteInterest(user.id, qid); // Pass the QID directly
            const updatedInterests:any = await getInterests(user.id);
            setInterests(updatedInterests);
        } catch (error) {
            console.error('Error removing interest:', error);
        }
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

            {/* Display current interests */}
            <div className="mb-6">
                <ul className="space-y-2">
                    {interests.map((interest) => (
                        <li key={interest.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                            <span>{interest.label || 'Unknown Label'}</span> {/* Show label */}
                            <button
                                onClick={() => handleRemoveInterest(interest.qid)} // Pass QID
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Search for new tags */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Search and Add New Interests</h3>
                <div className="flex items-center gap-2 mb-4">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for interests..."
                        className="border px-3 py-2 rounded w-full"
                    />
                    <button
                        onClick={searchTags}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Search
                    </button>
                </div>
                <ul className="space-y-2">
                    {searchResults.map((result) => (
                        <li key={result.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                            <span>
                                {result.label} {result.description && `(${result.description})`}
                            </span>
                            <button
                                onClick={() => toggleTagSelection(result)}
                                className={`px-3 py-1 rounded ${
                                    selectedTags.find((tag) => tag.id === result.id)
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-black hover:bg-gray-300'
                                }`}
                            >
                                {selectedTags.find((tag) => tag.id === result.id) ? 'Selected' : 'Select'}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Add selected tags */}
            <button
                onClick={handleAddInterests}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                Add Selected Interests
            </button>
        </div>
    );
};

export default MyInterests;
