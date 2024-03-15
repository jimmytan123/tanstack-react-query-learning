import { useIsFetching } from '@tanstack/react-query';

export default function Header({ children }) {
  // Provided by TanStack Query, return a value to indicate whether it is fetching
  const fetching = useIsFetching();

  return (
    <>
      <div id="main-header-loading">{fetching > 0 && <progress />}</div>
      <header id="main-header">
        <div id="header-title">
          <h1>React Events</h1>
        </div>
        <nav>{children}</nav>
      </header>
    </>
  );
}
