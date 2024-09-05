import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function CustomizedStepper({ steps, currentStep }) {
 
const theme = useTheme();
const downMd = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box sx={{ width: '100%' }}>
      {steps && steps.length > 1 ? (
        <Stepper activeStep={currentStep}>
          {steps.map((label, index) => {
            const isCurrentStep = index === currentStep;
            return (
              <Step key={label}>
                 <StepLabel
                  StepIconComponent={() => null}  // This removes the index numbers
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontSize: isCurrentStep ? '1.2rem' : '1rem',
                      fontWeight: isCurrentStep ? 'bold' : 'normal',
                      color: isCurrentStep ? 'primary' : 'primary.light',
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      ) : null}
    </Box>
  );
}

