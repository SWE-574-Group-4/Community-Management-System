import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // Replace with your actual backend base URL

// Fetch all interests for a specific user
export const getInterests = async (userId: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/users/${userId}/interests/`);
        return response.data; // The array of interests
    } catch (error) {
        console.error('Error fetching interests:', error);
        throw error;
    }
};

// Add a new interest for a user
export const addInterest = async (userId: number, tagId: number) => {
    try {
        const response = await axios.post(`${BASE_URL}/users/${userId}/interests/`, {
            tag: tagId, // Tag ID to be added as an interest
        });
        return response.data; // Success message or updated interest object
    } catch (error) {
        console.error('Error adding interest:', error);
        throw error;
    }
};

// Delete an interest for a user
export const deleteInterest = async (userId: number, interestId: number) => {
    try {
        const response = await axios.delete(`${BASE_URL}/users/${userId}/interests/`, {
            data: { interest_id: interestId }, // Pass the interest ID to delete
        });
        return response.data; // Success message
    } catch (error) {
        console.error('Error deleting interest:', error);
        throw error;
    }
};

// (Optional) Fetch all tags available for selection
export const getTags = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/tags/`); // Adjust endpoint if necessary
        return response.data; // Array of tags
    } catch (error) {
        console.error('Error fetching tags:', error);
        throw error;
    }
};
