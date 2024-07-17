import { format } from 'date-fns';  // Import the format function from date-fns
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  instance_id,
  instance_name,
  subnet_id,
  availability_zone,
  launch_time,
  status,
  handleClick,
  handleTerminate
}) {
  const isButtonDisabled = status === 'shutting-down' || status === 'terminated';

  let labelColor;

  if (status === 'stopped') {
    labelColor = 'error';
  } else if (status === 'running') {
    labelColor = 'success';
  } else {
    labelColor = 'primary';
  }


  return (
    <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
      <TableCell >
        <Button disabled={isButtonDisabled} onClick={() => handleClick(instance_id)}>
          {instance_id}
        </Button>
      </TableCell>
      <TableCell sx={{ maxWidth: 150 }} >{instance_name}</TableCell>
      <TableCell>{subnet_id}</TableCell>
      <TableCell>{availability_zone}</TableCell>
      <TableCell>
        <Label color={labelColor}>{status}</Label>

      </TableCell>
      <TableCell>{format(new Date(launch_time), 'dd-MM-yyyy HH:mm:ss')}</TableCell>
      <TableCell> 
        <Button
          disabled={isButtonDisabled}
          onClick={() =>
            handleTerminate(instance_id)
          }
          color="primary" startIcon={<Iconify icon="eva:trash-2-outline" />}
        >
          Terminate
        </Button>
      </TableCell>

    </TableRow>
  );
}

UserTableRow.propTypes = {
  instance_id: PropTypes.any,
  instance_name: PropTypes.any,
  selected: PropTypes.any,
  launch_time: PropTypes.any,
  subnet_id: PropTypes.any,
  availability_zone: PropTypes.any,
  status: PropTypes.string,
  handleClick: PropTypes.func.isRequired, // Add this line
  handleTerminate: PropTypes.func.isRequired, // Add this line
};
