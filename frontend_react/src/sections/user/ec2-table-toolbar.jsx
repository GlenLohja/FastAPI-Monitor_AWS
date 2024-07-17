import PropTypes from 'prop-types';
import React, { useState } from "react";

import Select from '@mui/material/Select';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableToolbar({ numSelected, filterName, onFilterName, onSelectRegion }) {

  const regions = [
    { label: "US East (Ohio)", value: "us-east-1" },
    { label: "US East (N. Virginia)", value: "us-east-2" },
    { label: "US West (N. California)", value: "us-west-1" },
    { label: "US West (Oregon)", value: "us-west-2" },
    { label: "Asia Pacific (Mumbai)", value: "ap-south-1" },
    { label: "Asia Pacific (Osaka)", value: "ap-northeast-3" },
    { label: "Asia Pacific (Seoul)", value: "ap-northeast-2" },
    { label: "Asia Pacific (Singapore)", value: "ap-southeast-1" },
    { label: "Asia Pacific (Sydney)", value: "ap-southeast-2" },
    { label: "Asia Pacific (Tokyo)", value: "ap-northeast-1" },
    { label: "Canada (Central)", value: "ca-central-1" },
    { label: "Europe (Frankfurt)", value: "eu-central-1" },
    { label: "Europe (Ireland)", value: "eu-west-1" },
    { label: "Europe (London)", value: "eu-west-2" },
    { label: "Europe (Paris)", value: "eu-west-3" },
    { label: "Europe (Stockholm)", value: "eu-north-1" },
    { label: "South America (São Paulo)", value: "sa-east-1" },
  ];

  const [regionSelected, setRegion] = useState('eu-west-1'); // Initialize with an empty string or the default region

  const handleSelectRegion = (selectedRegion) => {
    setRegion(selectedRegion)
    onSelectRegion(selectedRegion);
  };

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder="Search instance name..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
      )}

        <Select
            value={regionSelected}
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
  </Toolbar>
  );
}

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onSelectRegion: PropTypes.func,
};
