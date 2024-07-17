import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Lab 3 | User Interface </title>
      </Helmet>

      <UserView />
    </>
  );
}
