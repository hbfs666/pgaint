import React, { useMemo, useEffect, useState, lazy } from "react";
import { Box, TableContainer, Paper, Typography, Button } from "@mui/material";
import Loadable from "../../components/Loadable";
import CustomizedStepper from "../../components/Stepper";

const CreateKanban = Loadable(lazy(() => import("./createKanban")));
const CreateKanbanHeader = Loadable(lazy(()=>import("./createKanbanHeader")))
const CreateKanbanBody = Loadable(lazy(()=>import("./createKanbanBody")))

const addKanbanSteps = [
  'Create Kanban',
  'Add Kanban Header',
  'Add Kanban Body'
];

const AddKanban = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [kanbanRecord, setKanbanRecord] = useState(null);

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

 



  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <CreateKanban setKanbanRecord={setKanbanRecord} kanbanRecord={kanbanRecord} setActiveStep={setActiveStep} />
      case 1:
        return <CreateKanbanHeader kanbanRecord={kanbanRecord} setActiveStep={setActiveStep}/>;
      case 2:
        return <CreateKanbanBody kanbanRecord={kanbanRecord} setActiveStep={setActiveStep} />;
      // default:
      //   return <CreateKanban KanbanRecord={setKanbanRecord} setActiveStep={setActiveStep} />;
    }
  };
  //const customizedStepperComponent = useMemo(() => <CustomizedStepper steps={addKanbanSteps} currentStep={1} />, []);
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
        <CustomizedStepper steps={addKanbanSteps} currentStep={activeStep} />
      </Box>
      <Box
        mt={5}
        justifyContent="center"
        alignItems="center"
        height="30vh"
        width="60vw"
        mx="auto"
      >
        {renderStepContent(activeStep)}
      </Box>
      {/* <Box
       mt={5}
       justifyContent="center"
       alignItems="center"
       height="10vh"
       width="60vw"
       mx="auto">
        <Button onClick={nextStep}>Next</Button>
        <Button onClick={prevStep}>Prev</Button>
      </Box> */}
      
    </Box>
  );
};

export default AddKanban;
