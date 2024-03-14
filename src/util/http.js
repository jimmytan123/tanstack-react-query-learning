// Helper function to fetch events, throw error if occurs
export async function fetchEvents({ signal, searchTerm }) {
  let url = 'http://localhost:3000/events';

  // Construct API URL dynamically
  if (searchTerm) {
    url += '?search=' + searchTerm;
  }
  const response = await fetch(url, { signal: signal });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the events');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}
