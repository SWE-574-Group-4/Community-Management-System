// import axios from 'axios';

// const BASE_URL = 'http://localhost:8000'; // Replace with your actual backend base URL

// // Fetch all interests for a specific user
// export const getInterests = async (userId: number) => {
//     try {
//         const response = await axios.get(`${BASE_URL}/interests/${userId}/`);
//         return response.data; // The array of interests
//     } catch (error) {
//         console.error('Error fetching interests:', error);
//         throw error;
//     }
// };

// // Add a new interest for a user
// export const addInterest = async (userId: number, qid: string, label: string) => {
//     try {
//         const response = await axios.post(`${BASE_URL}/interests/${userId}/`, {
//             qid,   // QID of the tag to be added
//             label, // Label of the tag to be added
//         });
//         return response.data; // Success message or updated interest object
//     } catch (error) {
//         console.error('Error adding interest:', error);
//         throw error;
//     }
// };

// // Delete an interest for a user
// export const deleteInterest = async (userId: number, qid: string) => {
//     try {
//         const response = await axios.delete(`${BASE_URL}/interests/${userId}/`, {
//             data: { qid }, // Pass the QID of the tag to delete
//         });
//         return response.data; // Success message
//     } catch (error) {
//         console.error('Error deleting interest:', error);
//         throw error;
//     }
// };

// // (Optional) Fetch all tags available for selection
// // Use this function only if the /tags/ endpoint exists
// export const getTags = async () => {
//     try {
//         const response = await axios.get(`${BASE_URL}/tags/`); // Adjust endpoint if necessary
//         return response.data; // Array of tags
//     } catch (error) {
//         console.error('Error fetching tags:', error);
//         throw error;
//     }
// };
