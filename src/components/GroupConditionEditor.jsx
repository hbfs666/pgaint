import React, { useEffect, useState } from 'react';
import { Box, Chip, TextField, IconButton, MenuItem, Select, InputLabel, FormControl, useTheme, FormLabel, Typography } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { useError } from "../context/ErrorHandlerContext";



const GroupConditionEditor = ({ conditions, onConditionsChange, conditionsList }) => {
  const theme = useTheme();
  const [selectedCondition, setSelectedCondition] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [percentPosition, setPercentPosition] = useState('');
  const showMessage = useError();

  const handleAddCondition = () => {
    const trimmedCondition = selectedCondition.trim();
    const trimmedValue = valueInput.trim();
    const formattedValue = `${percentPosition === 'start' ? '%' : ''}${trimmedValue}${percentPosition === 'end' ? '%' : ''}`;
    
    if (trimmedCondition && trimmedValue) {
      const newCondition = `${trimmedCondition}=${formattedValue}`;
      if (!conditions.some(condition => condition.startsWith(trimmedValue))) {
        onConditionsChange([...conditions, newCondition]);
        setSelectedCondition('');
        setValueInput('');
        setPercentPosition('');
      } else {
        showMessage("Condition already exists", "error");
      }
    }
  };

  useEffect(() => {
    if (conditionsList === undefined) {
        showMessage("Condition List is not defined", "error");
        return
    }
  }, [showMessage, conditionsList]);

  const handleDeleteCondition = (conditionToDelete) => {
    onConditionsChange(conditions.filter((condition) => condition !== conditionToDelete));
  };

  return (
    <Box border={`1px solid ${theme.palette.divider}`} borderRadius={1} p={2} width="100%">
      <Typography>Group Conditions:</Typography>
      <Box
        display="flex"
        flexWrap="nowrap"
        overflow="auto"
        gap={0.8}
        mb={2}
        sx={{ maxWidth: '100%' }} // Add padding to avoid hidden scrollbars
      >
        <Box
          display="flex"
          flexWrap="nowrap"
          gap={0.8}
          sx={{ flexGrow: 1, minWidth: '0' }} // Allow the chips to take up available space and scroll if needed
        >
          {conditions.map((condition, index) => (
            <Chip
              key={index}
              label={condition}
              onDelete={() => handleDeleteCondition(condition)}
              color="primary"
              variant="outlined"
              sx={{ 
                color: theme.palette.text.primary, 
                borderColor: theme.palette.text.primary,
                '& .MuiChip-deleteIcon': {
                  color: theme.palette.mode === 'dark' ? 'red' : theme.palette.text.primary,
                },
              }}
            />
          ))}
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" gap={0.8}>
        <FormControl fullWidth >
          <InputLabel id="condition-label">Condition</InputLabel>
          <Select
            id="condition-label"
            name='condition'
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            label="Condition"
          >
            {conditionsList.map((condition, index) => (
              <MenuItem key={index} value={condition} id={`condition-${index}`}>{condition}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          label="Value"
          name='value'
          variant="outlined"
          fullWidth
          InputProps={{ style: { color: theme.palette.text.primary } }}
        />
        <FormControl fullWidth>
          <InputLabel id="percent-position-label">Percent Position</InputLabel>
          <Select
            id="percent-position-label"
            name="percentPosition"
            value={percentPosition}
            onChange={(e) => setPercentPosition(e.target.value)}
            label="Percent Position"
          >
            <MenuItem value="" id="percent-none">None</MenuItem>
            <MenuItem value="start"id="percent-start">% at Start</MenuItem>
            <MenuItem value="end" id="percent-end">% at End</MenuItem>
          </Select>
        </FormControl>
        <IconButton color="primary" onClick={handleAddCondition}>
          <AddCircle sx={{ color: theme.palette.mode === 'dark' ? 'lightgreen' : theme.palette.primary.main }}/>
        </IconButton>
      </Box>
    </Box>
  );
};

export default GroupConditionEditor;
