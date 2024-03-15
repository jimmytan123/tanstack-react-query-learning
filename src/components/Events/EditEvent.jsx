import {
  Link,
  redirect,
  useNavigate,
  useParams,
  useSubmit,
  useNavigation,
} from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchEvent, updateEvent, queryClient } from '../../util/http.js';

import ErrorBlock from '../UI/ErrorBlock.jsx';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';

export default function EditEvent() {
  const navigate = useNavigate();
  const { state } = useNavigation();
  const submit = useSubmit();
  const { id } = useParams();

  const { data, isError, error } = useQuery({
    queryKey: ['events', id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
    staleTime: 10000
  });

  // const { mutate } = useMutation({
  //   mutationFn: updateEvent,
  //   onMutate: async (data) => {
  //     // Will be excute right mutate() is called
  //     const newEvent = data.event;

  //     // Clear/Cancel ongoing queries for the data
  //     await queryClient.cancelQueries({ queryKey: ['events', id] });

  //     // Obtain the currently stored query data
  //     const previousEvent = queryClient.getQueryData(['events', id]);

  //     // Modify the cached query data manually, update the view instantly
  //     queryClient.setQueryData(['events', id], newEvent);

  //     return { previousEvent };
  //   },
  //   onError: (error, data, context) => {
  //     // Rollback the previous query data if mutation fails
  //     queryClient.setQueryData(['events', id], context.previousEvent);
  //   },
  //   onSettled: () => {
  //     // Will be excuted whenever mutation is done, make sure we fetching the latest from the BE, ensure in sync to BE
  //     queryClient.invalidateQueries(['events', id]);
  //   },
  // });

  function handleSubmit(formData) {
    // Programatically submit a form
    submit(formData, { method: 'PUT' });
  }

  function handleClose() {
    navigate('../');
  }

  let content;

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="Failed to load event"
          message={
            error.info?.message ||
            'Failed to load event. Please try again later'
          }
        />
        <div className="form-actions">
          <Link to="../" className="button">
            Ok
          </Link>
        </div>
      </>
    );
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        {state === 'submitting' ? (
          <p>Sending data</p>
        ) : (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Update
            </button>
          </>
        )}
      </EventForm>
    );
  }

  return <Modal onClose={handleClose}>{content}</Modal>;
}

// Loader function(returns a promise) for router
export function loader({ params }) {
  // Manually trigger TanStack query fetch
  return queryClient.fetchQuery({
    queryKey: ['events', params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const updatedEventData = Object.fromEntries(formData);

  await updateEvent({
    id: params.id,
    event: updatedEventData,
  });

  await queryClient.invalidateQueries(['events']);

  return redirect('../');
}
