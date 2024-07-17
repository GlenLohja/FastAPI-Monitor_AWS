import axios from 'axios';
import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../ec2-table-row';
import UserTableHead from '../ec2-table-head';
import TableEmptyRows from '../table-empty-rows';
import InstanceDetails from '../instance-details';
import UserTableToolbar from '../ec2-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------z

export default function UserPage() {
  const availabilityZones = [
    { label: 'US East (Ohio)', value: 'us-east-1' },
    { label: 'US East (N. Virginia)', value: 'us-east-2' },
    { label: 'US West (N. California)', value: 'us-west-1' },
    { label: 'US West (Oregon)', value: 'us-west-2' },
    { label: 'Asia Pacific (Mumbai)', value: 'ap-south-1' },
    { label: 'Asia Pacific (Osaka)', value: 'ap-northeast-3' },
    { label: 'Asia Pacific (Seoul)', value: 'ap-northeast-2' },
    { label: 'Asia Pacific (Singapore)', value: 'ap-southeast-1' },
    { label: 'Asia Pacific (Sydney)', value: 'ap-southeast-2' },
    { label: 'Asia Pacific (Tokyo)', value: 'ap-northeast-1' },
    { label: 'Canada (Central)', value: 'ca-central-1' },
    { label: 'Europe (Frankfurt)', value: 'eu-central-1' },
    { label: 'Europe (Ireland)', value: 'eu-west-1' },
    { label: 'Europe (London)', value: 'eu-west-2' },
    { label: 'Europe (Paris)', value: 'eu-west-3' },
    { label: 'Europe (Stockholm)', value: 'eu-north-1' },
    { label: 'South America (São Paulo)', value: 'sa-east-1' },
  ];

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [instances, setInstances] = useState([]);

  const [orderBy, setOrderBy] = useState('name');
  const [instanceDetailedData, setInstanceDetailedData] = useState({});
  const [openAddInstanceModal, setOpenAddInstanceModal] = useState(false);
  const [addingInstance, setAddingInstance] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [instanceSelected, setSelectedInstance] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorState, setErrorState] = useState(false);
  const [selectedRegion, setSelectedregion] = useState('');

  const fetchInstances = async (region = 'eu-west-1') => {
    try {
      setSelectedregion(region);
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/list-instances/${region}`);
      setInstances(response.data);
    } catch (error) {
      console.error('Error fetching instances:', error);
    }
  };

  useEffect(() => {
    fetchInstances();
  }, []);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: instances,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const [formData, setFormData] = useState({
    instance_name: '',
    security_group_id: '',
    region_name: '',
    instance_type: '',
    image_id: '',
  });

  const handleViewInstanceClick = async (instanceId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/instance-details/${instanceId}/${selectedRegion}`
      );

      setInstanceDetailedData(response.data); // Use spread operator
    } catch (error) {
      console.error('Error fetching details:', error);
    }

    setSelectedInstance(instanceId);
  };

  const handleStartButton = async (instanceId) => {
    try {
      await axios.get(
        `http://127.0.0.1:8000/api/v1/start-instance/${instanceId}/${selectedRegion}`
      );

      handleViewInstanceClick(instanceId);
    } catch (error) {
      console.error('Error starting instance:', error);
    }
  };
  const handleStopButton = async (instanceId) => {
    try {
      await axios.get(`http://127.0.0.1:8000/api/v1/stop-instance/${instanceId}/${selectedRegion}`);
      handleViewInstanceClick(instanceId);
    } catch (error) {
      console.error('Error starting instance:', error);
    }
  };

  const handleTerminateButton = async (instanceId) => {
    try {
      await axios.get(
        `http://127.0.0.1:8000/api/v1/terminate-instance/${instanceId}/${selectedRegion}`
      );
      fetchInstances(selectedRegion);
    } catch (error) {
      console.error('Error starting instance:', error);
    }
  };

  const handleBackButton = async () => {
    fetchInstances(selectedRegion);
    setInstanceDetailedData([]);
    setSelectedInstance(null);
  };

  const handeAddInstanceButton = () => {
    setOpenAddInstanceModal(true);
  };

  const handleCloseAddInstanceModal = () => {
    setOpenAddInstanceModal(false);
  };

  const handleAddNewInstance = async () => {
    try {
      setAddingInstance(true);

      const { instance_name, security_group_id, region_name, instance_type, image_id } = formData;
      await axios.post('http://127.0.0.1:8000/api/v1/create-instance', {
        instance_name,
        security_group_id,
        region_name,
        instance_type,
        image_id,
      });
      handleCloseAddInstanceModal();
      fetchInstances(selectedRegion);
    } catch (error) {
      setErrorState(true);
      setErrorMessage(error.response.data.detail);
    } finally {
      setAddingInstance(false);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Dialog
        open={openAddInstanceModal}
        onClose={handleCloseAddInstanceModal}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Add New Instance</DialogTitle>
        <DialogContent>
          {errorState && (
            <Label sx={{ mb: 3 }} color="error">
              {errorMessage}
            </Label>
          )}
          <form>
            <InputLabel id="instance_name_field">Instance Name</InputLabel>
            <TextField
              variant="outlined"
              fullWidth
              margin="normal"
              name="instance_name"
              onChange={handleChange}
            />

            <InputLabel id="sc_group_id_field">Security Group ID</InputLabel>
            <TextField
              variant="outlined"
              fullWidth
              margin="normal"
              name="security_group_id"
              onChange={handleChange}
            />

            <InputLabel id="image_id_field">Image ID</InputLabel>
            <TextField
              variant="outlined"
              fullWidth
              margin="normal"
              name="image_id"
              onChange={handleChange}
            />
            <InputLabel id="instance_type_field">Instance Type</InputLabel>
            <TextField
              variant="outlined"
              fullWidth
              margin="normal"
              name="instance_type"
              onChange={handleChange}
              defaultValue="t2.micro"
              disabled
            />
            <InputLabel id="region_name_selector">Select Region Name</InputLabel>
            <Select
              label="Region Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="region_name"
              onChange={handleChange}
            >
              <MenuItem value="">Select Region</MenuItem>
              {availabilityZones.map((zone) => (
                <MenuItem key={zone.value} value={zone.value}>
                  {zone.label}
                </MenuItem>
              ))}
            </Select>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddInstanceModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddNewInstance} color="primary" disabled={addingInstance}>
            {addingInstance ? <CircularProgress size={24} color="inherit" /> : 'Add Instance'}
          </Button>
        </DialogActions>
      </Dialog>

      {instanceSelected === null && (
        <>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4">EC2 Instances</Typography>

            <Button
              variant="contained"
              onClick={() => handeAddInstanceButton()}
              color="inherit"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Instance
            </Button>
          </Stack>

          <Card>
            <UserTableToolbar
              filterName={filterName}
              onFilterName={handleFilterByName}
              onSelectRegion={fetchInstances}
            />

            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <UserTableHead
                    order={order}
                    orderBy={orderBy}
                    rowCount={instances.length}
                    onRequestSort={handleSort}
                    headLabel={[
                      { id: 'instance_id', label: 'Instance ID' },
                      { id: 'instance_name', label: 'Name' },
                      { id: 'subnet_id', label: 'Subnet ID' },
                      { id: 'availability_zone', label: 'Avaiability Zone', align: 'center' },
                      { id: 'status', label: 'Status' },
                      { id: 'launch_time', label: 'Launch Time' },
                      { id: 'action', label: 'Terminate' },
                    ]}
                  />
                  <TableBody>
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <UserTableRow
                          instance_id={row.instance_id}
                          instance_name={row.instance_name}
                          subnet_id={row.subnet_id}
                          availability_zone={row.availability_zone}
                          status={row.status}
                          launch_time={row.launch_time}
                          handleClick={() => handleViewInstanceClick(row.instance_id)}
                          handleTerminate={handleTerminateButton}
                        />
                      ))}

                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, instances.length)}
                    />

                    {notFound && <TableNoData query={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              page={page}
              component="div"
              count={instances.length}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </>
      )}
      {instanceSelected !== null && (
        <>
          <Grid container spacing={2} mb={2}>
            {instanceDetailedData.instance_details.status === 'running' && (
              <>
                <Grid item xs={6} sm={6} md={6}>
                  <Button
                    onClick={() => handleStopButton(instanceSelected)}
                    variant="contained"
                    color="error"
                    startIcon={<Iconify icon="eva:pause-circle-outline" />}
                  >
                    Stop
                  </Button>
                </Grid>
                <Grid item xs={6} sm={6} md={6} sx={{ textAlign: 'right' }}>
                  <Button
                    onClick={() => handleBackButton()}
                    variant="contained"
                    startIcon={<Iconify icon="eva:arrow-back-outline" />}
                  >
                    Back
                  </Button>
                </Grid>
              </>
            )}

            {instanceDetailedData.instance_details.status === 'stopped' && (
              <>
                <Grid item xs={6} sm={6} md={6}>
                  <Button
                    onClick={() => handleStartButton(instanceSelected)}
                    variant="contained"
                    color="success"
                    startIcon={<Iconify icon="eva:play-circle-outline" />}
                  >
                    Start
                  </Button>
                </Grid>
                <Grid item xs={6} sm={6} md={6} sx={{ textAlign: 'right' }}>
                  <Button
                    onClick={() => handleBackButton()}
                    variant="contained"
                    startIcon={<Iconify icon="eva:arrow-back-outline" />}
                  >
                    Back
                  </Button>
                </Grid>
              </>
            )}

            {instanceDetailedData.instance_details.status !== 'running' &&
              instanceDetailedData.instance_details.status !== 'stopped' && (
                <Grid item xs={12} sm={12} md={12} sx={{ textAlign: 'right' }}>
                  <Button
                    onClick={() => handleBackButton()}
                    variant="contained"
                    startIcon={<Iconify icon="eva:arrow-back-outline" />}
                  >
                    Back
                  </Button>
                </Grid>
              )}
          </Grid>
          <InstanceDetails
            network_details={instanceDetailedData.network_details}
            instance_details={instanceDetailedData.instance_details}
            ami_details={instanceDetailedData.ami_details}
          />
        </>
      )}
    </Container>
  );
}
