import axios from 'axios';
import ENV from '../../config.json';

export const fetchUserData = async () => {
    const authEmail = localStorage.getItem('auth_email');
    const authToken = localStorage.getItem('auth_token');
    
    if (authEmail && authToken) {
        try {
            const response = await axios.get(`${ENV.base_url}users/email/${authEmail}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
            });
            return response.data.user;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    } else {
        throw new Error('Authentication required.');
    }
};