import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'S3 Buckets',
    path: '/',
    icon: icon('folder-outline'),
  },
  {
    title: 'EC2',
    path: '/instances',
    icon: icon('hard-drive-outline'),
  },
  {
    title: 'CloudWatch',
    path: '/cloudwatch',
    icon: icon('activity-outline'),
  },
];

export default navConfig;
