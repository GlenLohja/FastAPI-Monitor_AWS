import { format } from 'date-fns'; // Import the format function from date-fns
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function InstanceDetails({ network_details, ami_details, instance_details }) {
  let labelColor;

  if (instance_details.status === 'stopped') {
    labelColor = 'error';
  } else if (instance_details.status === 'running') {
    labelColor = 'success';
  } else {
    labelColor = 'primary';
  }

  return (
    <Card>
      <CardHeader title="Instance Details" subheader={instance_details.instance_id} />

      <Scrollbar>
        <Stack spacing={2} sx={{ p: 3, pr: 0 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              component="img"
              alt="Instance"
              src="/assets/icons/navbar/hard-drive-outline.svg"
              sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
            />

            <Box sx={{ minWidth: 240 }}>
              <Link color="inherit" variant="subtitle2" underline="hover">
                Instance name
              </Link>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {instance_details.instance_name}
              </Typography>
            </Box>

            <Box sx={{ minWidth: 240 }}>
              <Link color="inherit" variant="subtitle2" underline="hover">
                Launch Date
              </Link>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {format(new Date(instance_details.launch_time), 'dd-MM-yyyy HH:mm:ss')}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 240 }}>
              <Link color="inherit" variant="subtitle2" underline="hover">
                Instance type
              </Link>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {instance_details.instance_type}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 240 }}>
              <Link color="inherit" variant="subtitle2" underline="hover">
                Instance type
              </Link>
              <Divider sx={{ borderStyle: 'none' }} />
              <Label sx={{ mt: 0 }} color={labelColor}>
                {instance_details.status}
              </Label>
            </Box>
          </Stack>
        </Stack>
      </Scrollbar>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <CardHeader title="Network Details" subheader={instance_details.instance_id} />
      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              component="img"
              alt="Instance"
              src="/assets/icons/globe-outline.svg"
              sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
            />

            <Box sx={{ minWidth: 240 }}>
              <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
                Subnet ID
              </Link>

              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {network_details.subnet_id}
              </Typography>
            </Box>

            <Box sx={{ minWidth: 240 }}>
              <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
                Availability Zone
              </Link>

              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {network_details.availability_zone}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 240 }}>
              <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
                Private Ip Address
              </Link>

              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {network_details.private_ip_address}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 240 }}>
              <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
                Public Ip Address
              </Link>

              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {network_details.public_ip_address}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Scrollbar>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <CardHeader title="Ami Image Details" subheader={instance_details.instance_id} />
      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              component="img"
              alt="Instance"
              src="/assets/icons/navbar/folder-outline.svg"
              sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
            />

            <Box sx={{ minWidth: 240 }}>
              <Link color="inherit" variant="subtitle2" underline="hover">
                AMI ID
              </Link>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {ami_details.ImageId}
              </Typography>
            </Box>

            <Box sx={{ maxWidth: 240 }}>
              <Link color="inherit" variant="subtitle2" underline="hover">
                Image Location
              </Link>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {ami_details.ImageLocation}
              </Typography>
            </Box>
            <Box sx={{ maxWidth: 240, flexGrow: 1 }}>
              <Link color="inherit" variant="subtitle2" underline="hover">
                Ami Name
              </Link>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {ami_details.Description}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 240, flexGrow: 1 }}>
              <Link color="inherit" variant="subtitle2" underline="hover">
                Platform Details
              </Link>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {ami_details.PlatformDetails}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Scrollbar>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <CardHeader title="Other Details" subheader={instance_details.instance_id} />
      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              component="img"
              alt="Instance"
              src="/assets/icons/code-outline.svg"
              sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
            />

            <Box sx={{ minWidth: 240 }}>
              <Link color="inherit" variant="subtitle2" underline="hover">
                Key Name
              </Link>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {instance_details.key_name}
              </Typography>
            </Box>

            <Box sx={{ minWidth: 240 }}>
              <Link color="inherit" variant="subtitle2" underline="hover">
                Boot Mode
              </Link>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {instance_details.boot_mode}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 240 }}>
              <Link color="inherit" variant="subtitle2" underline="hover">
                Launch Date
              </Link>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {format(new Date(instance_details.launch_time), 'dd-MM-yyyy HH:mm:ss')}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 240 }}>
              <Link color="inherit" variant="subtitle2" underline="hover">
                Architecture
              </Link>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {ami_details.Architecture}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Scrollbar>
    </Card>
  );
}

InstanceDetails.propTypes = {
  instance_details: PropTypes.object,
  network_details: PropTypes.object,
  ami_details: PropTypes.object,
};
