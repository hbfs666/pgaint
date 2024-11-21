import React, { useMemo, useEffect, useState, lazy } from "react";
import {
  Box,
  TableContainer,
  Paper,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import Loadable from "../../components/Loadable";
import CustomizedStepper from "../../components/Stepper";
import { useError } from "../../context/ErrorHandlerContext";

const EditKanban = Loadable(lazy(() => import("./editKanban")));
const EditKanbanHeader = Loadable(lazy(() => import("./editKanbanHeader")));
const EditKanbanBody = Loadable(lazy(() => import("./editKanbanBody")));

const editKanbanSteps = [
  "Edit Kanban",
  "Edit Kanban Header",
  "Edit Kanban Body",
];

const InActiveKanban = ({ kanbanMappingKey }) => {
  const showMessage = useError();
  const [activeStep, setActiveStep] = useState(0);
  const [kanbanRecord, setKanbanRecord] = useState(null);
  const [onError, setOnError] = useState(false);
  const theme = useTheme();
  function nextStep() {
    if (activeStep + 1 > 2) {
      setActiveStep(0);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  }
  function prevStep() {
    if (activeStep === 0) {
      setActiveStep(2);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  }
  useEffect(() => {
    if (kanbanMappingKey == "") {
      showMessage("Mapping Key not found", "error");
      setOnError(true);
    }
  });
  useEffect(() => {
    if (kanbanMappingKey != "") {
      setOnError(false);
      //setKanbanRecord(null)
    }
  });
  useEffect(() => {
    if (kanbanMappingKey != "") {
        setActiveStep(0)
        setKanbanRecord(null)
    }
  },[kanbanMappingKey])

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <EditKanban
            setKanbanRecord={setKanbanRecord}
            kanbanRecord={kanbanRecord}
            setActiveStep={setActiveStep}
            mappingKey={kanbanMappingKey}
            setOnError={setOnError}
          />
        );
      case 1:
        return (
          <EditKanbanHeader
            kanbanRecord={kanbanRecord}
            setActiveStep={setActiveStep}
          />
        );
        case 2:
          return <EditKanbanBody kanbanRecord={kanbanRecord} setActiveStep={setActiveStep} />;
    }
  };

  return (
    <Box>
      <Box
        mt={5}
        justifyContent="center"
        alignItems="center"
        height="5vh"
        width="80vw"
        mx="auto"
      >
        {!onError ? (
          <CustomizedStepper steps={editKanbanSteps} currentStep={activeStep} />
        ) : null}
      </Box>
      <Box
        mt={5}
        justifyContent="center"
        alignItems="center"
        height="30vh"
        width="60vw"
        mx="auto"
      >
        {!onError ? renderStepContent(activeStep) : null}
        {onError ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
              bgcolor: theme.palette.background.default,
              color: theme.palette.text.primary,
              textAlign: "center",
              p: 3,
            }}
          >
            <Typography variant="h2" color="error" gutterBottom>
              Error
            </Typography>
            <Typography variant="h6">
              Please switch or edit other Kanban from side menu.
            </Typography>
          </Box>
        ) : null}
      </Box>
      {/* <Box
        mt={5}
        justifyContent="center"
        alignItems="center"
        height="10vh"
        width="60vw"
        mx="auto"
      >
        <Button onClick={nextStep}>Next</Button>
        <Button onClick={prevStep}>Prev</Button>
      </Box> */}
    </Box>
  );
};

export default InActiveKanban;
