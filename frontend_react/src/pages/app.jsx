import { Helmet } from 'react-helmet-async';

import { AppView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Lab 3 | User Interface </title>
      </Helmet>

      <AppView />
    </>
  );
}
