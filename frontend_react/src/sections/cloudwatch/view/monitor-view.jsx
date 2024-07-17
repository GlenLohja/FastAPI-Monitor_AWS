import axios from 'axios';
import { faker } from '@faker-js/faker';
import React, { useState, useEffect } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import { Select, MenuItem, Container, Typography, OutlinedInput } from '@mui/material';

import Label from 'src/components/label';

import AppWebsiteVisits from '../cpu-utilization-graph';
import AppOrderTimeline from '../cpu-balance-credit-timeline';
// ----------------------------------------------------------------------

export default function CloudWatchView() {
  const [instances, setInstances] = useState([]);
  const [selectedRegion, setSelectedregion] = useState('');
  const [selectedInstance, setSelectedInstance] = useState('');
  const [selectedInstanceData, setSelectedInstanceData] = useState([]);

  const regions = [
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

  const handleSelectRegion = (regionInput) => {
    setSelectedregion(regionInput);
    fetchInstances(regionInput);
  };

  const formatCpuUtilization = (value) => {
    const formattedValue = value.toFixed(3);
    return formattedValue;
  };

  const handleSelectInstance = async (instanceId) => {
    setSelectedInstance(instanceId);

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/monitor-instance/${instanceId}`
      );
      console.log(response.data);
      setSelectedInstanceData(response.data); // Use spread operator
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

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

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={6} sm={6} md={6}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Monitor Instance 🔍
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {selectedInstance}
          </Typography>
          {!selectedInstanceData.CPUUtilization && (
            <Label sx={{ mt: 2 }} color="primary">
              Select an Instance
            </Label>
          )}
          {selectedInstanceData.CPUUtilization &&
            Object.keys(selectedInstanceData.CPUUtilization).length === 0 && (
              <Label sx={{ mt: 2 }} color="primary">
                No data available for the selected instance.
              </Label>
            )}
        </Grid>

        <Grid xs={6} sm={6} md={6} sx={{ textAlign: 'right' }}>
          <Select
            value={selectedRegion}
            onChange={(event) => handleSelectRegion(event.target.value)}
            displayEmpty
            input={<OutlinedInput label="Region" />}
            style={{ marginLeft: '8px' }}
          >
            <MenuItem value="" disabled>
              Select Region
            </MenuItem>
            {regions.map((region) => (
              <MenuItem key={region.value} value={region.value}>
                {region.label}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={selectedInstance}
            onChange={(event) => handleSelectInstance(event.target.value)}
            displayEmpty
            input={<OutlinedInput label="Region" />}
            style={{ marginLeft: '20px' }}
          >
            <MenuItem value="">Select Instance</MenuItem>
            {instances.map((instance) => (
              <MenuItem key={instance.instance_id} value={instance.instance_id}>
                {instance.instance_id}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        {selectedInstanceData.CPUUtilization &&
          Object.keys(selectedInstanceData.CPUUtilization).length > 0 && (
            <Grid xs={12} md={6} lg={8}>
              <AppWebsiteVisits
                title="CPU Utilization (%)"
                subheader={
                  <Typography
                    variant="subtitle2"
                    style={{ color: 'grey', paddingBottom: '20px', paddingTop: '13px' }}
                  >
                    Last Three hours
                  </Typography>
                }
                chart={{
                  labels: selectedInstanceData.CPUUtilization
                    ? Object.keys(selectedInstanceData.CPUUtilization).map((timestamp) => timestamp)
                    : [],
                  series: [
                    {
                      name: 'CPU Utilization',
                      type: 'line',
                      fill: 'solid',
                      data: selectedInstanceData.CPUUtilization
                        ? Object.values(selectedInstanceData.CPUUtilization).map(
                            formatCpuUtilization
                          )
                        : [],
                    },
                  ],
                }}
              />
            </Grid>
          )}

        {selectedInstanceData.CPUUtilization &&
          Object.keys(selectedInstanceData.CPUUtilization).length > 0 && (
            <Grid xs={12} md={6} lg={4}>
              <AppOrderTimeline
                title="CPU Credit Balance Timeline"
                list={
                  selectedInstanceData.CPUCreditBalance
                    ? Object.keys(selectedInstanceData.CPUCreditBalance)
                        .slice(0, 6)
                        .map((timestamp, index) => ({
                          id: faker.string.uuid(),
                          title: `CPU Credit Balance: ${selectedInstanceData.CPUCreditBalance[timestamp]}`,
                          type: `order${index + 1}`,
                          time: new Date(timestamp),
                        }))
                    : []
                }
              />
            </Grid>
          )}
      </Grid>
    </Container>
  );
}
