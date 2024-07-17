import axios from 'axios';
import { format } from 'date-fns'; // Import the format function from date-fns
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import {
  Card,
  Paper,
  Table,
  Button,
  Snackbar,
  TableBody,
  TableHead,
  TableContainer,
} from '@mui/material';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import UserTableHead from '../s3-table-head';
import TableToolBar from '../s3-table-toolbar';
import AppWidgetSummary from '../app-widget-summary';
import { applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function AppView({ selected }) {
  const [filterName, setFilterName] = useState('');
  const [page, setPage] = useState(0);
  const [buckets, setBuckets] = useState([]);
  const [objects, setObjects] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [successAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [pageTitle, setPageTitle] = useState('S3 Buckets 📁');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy] = useState('bucket_name');
  const [order] = useState('asc');

  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/list-buckets');
        setBuckets(response.data.Buckets);
      } catch (error) {
        console.error('Error fetching buckets:', error);
      }
    };

    fetchBuckets();
  }, []);

  const fetchObjectsForBucket = async (bucketName) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/list-objects/${bucketName}`);
      setObjects([...response.data.objects]); // Use spread operator
    } catch (error) {
      console.error('Error fetching objects:', error);
    }
  };
  const handleViewObjectsClick = (bucketName) => {
    setSelectedBucket(bucketName);
    fetchObjectsForBucket(bucketName);
    setPageTitle(`${bucketName} Objects 📁`);
  };

  const handleDeleteClick = async (bucketName, fileName) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/delete-bucket/${bucketName}/${fileName}`
      );
      // Refresh the objects list after deletion
      fetchObjectsForBucket(bucketName);

      setSuccessMessage(JSON.stringify(response.data.message, null, 2));
      setSuccessAlert(true);
      // Automatically hide the alert after 3000 milliseconds (3 seconds)
      setTimeout(() => {
        setSuccessMessage('');
        setSuccessAlert(false);
      }, 3000);
    } catch (error) {
      console.error('Error deleting object:', error);
    }
  };

  const handleBackButton = async () => {
    setSelectedBucket(null);
    setPageTitle('S3 Buckets 📁');
  };

  const handleDownloadClick = async (bucketName, fileName) => {
    try {
      // Use a hidden iframe to trigger file download
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = `http://127.0.0.1:8000/api/v1/download-file/${bucketName}/${fileName}`;
      document.body.appendChild(iframe);

      setSuccessMessage('Sucessfully downloaded');
      setSuccessAlert(true);
      // Automatically hide the alert after 3000 milliseconds (3 seconds)
      setTimeout(() => {
        setSuccessMessage('');
        setSuccessAlert(false);
      }, 3000);
    } catch (error) {
      console.error('Error downloading object:', error);
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
    inputData: buckets,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={6} sm={6} md={6}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            {pageTitle}
          </Typography>
        </Grid>

        {selectedBucket && objects.length >= 0 && (
          <Grid xs={6} sm={6} md={6} sx={{ textAlign: 'right' }}>
            <Button
              onClick={() => handleBackButton()}
              variant="contained"
              startIcon={<Iconify icon="eva:arrow-back-outline" />}
            >
              Back
            </Button>
          </Grid>
        )}

        <Grid xs={12} sm={12} md={12}>
          {selectedBucket === null && (
            <AppWidgetSummary
              title="Number of buckets"
              total={buckets.length}
              color="success"
              icon={<img alt="icon" src="/assets/icons/glass/s3buckets.png" />}
            />
          )}

          {selectedBucket && objects.length > 0 && (
            <AppWidgetSummary
              title="Number of objects"
              total={objects.length}
              color="success"
              icon={<img alt="icon" src="/assets/icons/glass/s3buckets.png" />}
            />
          )}

          {selectedBucket && objects.length === 0 && (
            <AppWidgetSummary
              title={`No objects in ${selectedBucket}`}
              color="success"
              icon={<img alt="icon" src="/assets/icons/glass/s3buckets.png" />}
            />
          )}
        </Grid>
      </Grid>

      <Card>
        {selectedBucket === null && (
          <TableToolBar filterName={filterName} onFilterName={handleFilterByName} />
        )}
        <Grid container spacing={3}>
          <Grid xs={12} sm={12} md={12}>
            {selectedBucket === null && (
              <TableContainer>
                <Table>
                  <UserTableHead
                    order={order}
                    orderBy={orderBy}
                    rowCount={buckets.length}
                    headLabel={[
                      { id: 'bucket_name', label: 'Bucket Name' },
                      { id: 'creation_date', label: 'Creation date' },
                      { id: '', label: 'Action' },
                    ]}
                  />
                  <TableBody>
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((bucket) => (
                        <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                          <TableCell component="th" scope="row">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Label>📁</Label>
                              <Typography variant="subtitle2" noWrap>
                                {bucket.Name}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell>
                            {format(new Date(bucket.CreationDate), 'dd-MM-yyyy HH:mm:ss')}
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleViewObjectsClick(bucket.Name)}
                              variant="contained"
                              startIcon={<Iconify icon="eva:more-horizontal-outline" />}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {selectedBucket && objects.length > 0 && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Delete Action</TableCell>
                      <TableCell>Download Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {objects.map((object, index) => (
                      <TableRow key={index}>
                        <TableCell>{object}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleDeleteClick(selectedBucket, object)}
                            variant="contained"
                            color="error"
                            startIcon={<Iconify icon="eva:trash-2-outline" />}
                          >
                            Delete
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleDownloadClick(selectedBucket, object)}
                            variant="contained"
                            color="success"
                            startIcon={<Iconify icon="eva:download-outline" />}
                          >
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </Grid>
      </Card>
      <TablePagination
        page={page}
        component="div"
        count={buckets.length}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={successAlert}
        autoHideDuration={3000}
        onClose={() => {
          setSuccessMessage('');
          setSuccessAlert(false);
        }}
      >
        <Paper
          style={{
            backgroundColor: 'green',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          {successMessage}
        </Paper>
      </Snackbar>
    </Container>
  );
}

AppView.propTypes = {
  selected: PropTypes.any,
};
