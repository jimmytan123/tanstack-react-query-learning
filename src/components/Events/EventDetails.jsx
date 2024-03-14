import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchEvent, deleteEvent, queryClient } from '../../util/http.js';

import Header from '../Header.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';

export default function EventDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['events', { id: id }],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  const {
    mutate,
    isPending: isMutationPending,
    isError: isMutationError,
    error: mutationError,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate('/events');
    },
  });

  function handleDelete(id) {
    mutate({ id });
  }

  let content;

  if (isPending) {
    content = (
      <div id="event-details-content" className="center">
        <LoadingIndicator />
        <p>Loading event detail...</p>
      </div>
    );
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="Loading Event Details Error"
        message={
          error.info?.message || 'Something wrong in fetching event details.'
        }
      />
    );
  }

  if (data) {
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    content = (
      <>
        <header>
          <h1>{data.title}</h1>
          {isMutationError && (
            <ErrorBlock
              title="Delete Error"
              message={
                mutationError.info?.message ||
                'Something wrong in deleting event. Try again later'
              }
            />
          )}
          {!isMutationPending && (
            <nav>
              <button onClick={() => handleDelete(data.id)}>Delete</button>
              <Link to="edit">Edit</Link>
            </nav>
          )}
        </header>
        <div id="event-details-content">
          <img
            src={`http://localhost:3000/${data.image}`}
            alt={`Image of ${data.title}`}
          />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {formattedDate} @ {data.time}
              </time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">{content}</article>
    </>
  );
}
