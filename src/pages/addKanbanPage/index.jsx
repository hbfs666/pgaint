import React, { useMemo, useEffect, useState, lazy } from "react";
import { Box, TableContainer, Paper, Typography, Button } from "@mui/material";
import Header from "../../components/header";
import Loadable from "../../components/Loadable";
import CustomizedStepper from "../../components/Stepper";
import LandingPage from "../landingPage";

const CreateKanban = Loadable(lazy(() => import("./createKanban")));
const KanbanHeader = Loadable(lazy(()=>import("./createKanbanHeader")))

const addKanbanSteps = [
  'Kanban',
  'Kanban Header',
  'Kanban Body'
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
        return <KanbanHeader kanbanRecord={kanbanRecord} setActiveStep={setActiveStep}/>;
      case 2:
        //return <CreateKanbanBody mappingNumber={mappingNumber} />;
      default:
        return <CreateKanban KanbanRecord={setKanbanRecord} setActiveStep={setActiveStep} />;
    }
  };
  //const customizedStepperComponent = useMemo(() => <CustomizedStepper steps={addKanbanSteps} currentStep={1} />, []);
  return (
    <Box>
      <Box
        mt={5}
        justifyContent="center"
        alignItems="center"
        height="10vh"
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
      <Box
       mt={5}
       justifyContent="center"
       alignItems="center"
       height="10vh"
       width="60vw"
       mx="auto">
        <Button onClick={nextStep}>Next</Button>
        <Button onClick={prevStep}>Prev</Button>
      </Box>
      
    </Box>
  );
};

export default AddKanban;
