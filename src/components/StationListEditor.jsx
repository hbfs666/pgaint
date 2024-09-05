import React, { useState } from 'react';
import { Box, Chip, TextField, IconButton, useTheme, FormLabel } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { useError } from "../context/ErrorHandlerContext";

const StationListEditor = ({ stations, onStationsChange }) => {
  const theme = useTheme();
  const [stationInput, setStationInput] = useState('');
  const showMessage = useError();

  const handleAddStation = () => {
    const trimmedInput = stationInput.trim().toUpperCase();
    if (trimmedInput && !stations.includes(trimmedInput)) {
      onStationsChange([...stations, trimmedInput]);
      setStationInput('');
    } else if (stations.includes(trimmedInput)) {
      showMessage("Station already exists", "error");
    }
  };

  const handleDeleteStation = (stationToDelete) => {
    onStationsChange(stations.filter((station) => station !== stationToDelete));
  };

  return (
    <Box border={`1px solid ${theme.palette.divider}`} borderRadius={1} p={2} width="100%">
         <FormLabel>Station List:</FormLabel>
      <Box
        display="flex"
        flexWrap="nowrap"
        overflow="auto"
        gap={1}
        mb={2}
        sx={{ maxWidth: '100%' }} // Add padding to avoid hidden scrollbars
      >
       
         <Box
          display="flex"
          flexWrap="nowrap"
          gap={1}
          sx={{ flexGrow: 1, minWidth: '0' }} // Allow the chips to take up available space and scroll if needed
        >
        {stations.map((station, index) => (
          <Chip
            key={index}
            label={station}
            onDelete={() => handleDeleteStation(station)}
            color="primary"
            variant="outlined"
            sx={{ 
                color: theme.palette.text.primary, 
                borderColor: theme.palette.text.primary,
                '& .MuiChip-deleteIcon': {
                  color: theme.palette.mode === 'dark' ? 'red' : theme.palette.text.primary,
                },
              }}
            style={{ textTransform: 'uppercase' }}
          />
        ))}</Box>
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <TextField
          value={stationInput}
          onChange={(e) => setStationInput(e.target.value)}
          label="New Station"
          variant="outlined"
          fullWidth
          InputProps={{ style: { color: theme.palette.text.primary } }}
          InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
        />
        <IconButton color="primary" onClick={handleAddStation}>
          <AddCircle sx={{ color: theme.palette.mode === 'dark' ? 'lightgreen' : theme.palette.primary.main }}/>
        </IconButton>
      </Box>
    </Box>
  );
};

export default StationListEditor;

