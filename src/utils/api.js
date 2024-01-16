const API_URL = 'https://hiring-react-assignment.vercel.app/api/bot';

export const requestBotMove = async (board) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(board),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bot move');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
