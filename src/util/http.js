import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

// Helper function to GET request fetch events, throw error if occurs
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

// POST to http://localhost:3000/events with eventData as body payload
export async function createNewEvent(eventData) {
  const response = await fetch(`http://localhost:3000/events`, {
    method: 'POST',
    body: JSON.stringify(eventData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error('An error occured while creating the event.');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}

// GET to http://localhost:3000/events/images
export async function fetchSelectableImages({ signal }) {
  const response = await fetch('http://localhost:3000/events/images', {
    signal,
  });

  if (!response.ok) {
    const error = new Error('An error occured while fetching the images.');
    error.code = response.status;
    error.info = await response.json();

    throw error;
  }

  const { images } = await response.json();

  return images;
}
