import { Helmet } from 'react-helmet-async';

import { CloudWatchView } from 'src/sections/cloudwatch/view';

// ----------------------------------------------------------------------

export default function CloudWatchPage() {
  return (
    <>
      <Helmet>
        <title> Lab 3 | User Interface </title>
      </Helmet>

      <CloudWatchView />
    </>
  );
}
