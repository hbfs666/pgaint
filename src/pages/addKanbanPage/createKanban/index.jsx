import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Grid,
  useTheme,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { createKanban } from "../../../api/apiClientService";
import { useError } from "../../../context/ErrorHandlerContext";

const KanbanForm = ({setKanbanRecord, kanbanRecord, setActiveStep }) => {
  const showMessage = useError();
  const [formValues, setFormValues] = useState({
    kanbanName: "",
    productType: "",
    rmaSite: "",
    envType: "",
  });

  const [buttonActive, setButtonActive] = useState(true);

  const theme = useTheme(); // Get the current theme

  // Use useMutation for form submission
  const mutation = useMutation({
    mutationFn: () =>
      createKanban(
        formValues.kanbanName,
        formValues.productType,
        formValues.rmaSite,
        formValues.envType
      ),
    onMutate: () => {
      setButtonActive(false); // Disable the button while loading
    },
    onError: (error) => {
      showMessage("Error in creating kanban: " + error.message, "error");
      setButtonActive(true); // Re-enable the button if there's an error
    },
    onSuccess: (data) => {
      setButtonActive(false);
      showMessage("Kanban created successfully", "success");
      setKanbanRecord(data);
    },
  });

  useEffect(() => {
    if (kanbanRecord!=null) {
      setFormValues({
        kanbanName: kanbanRecord.kanban_name,
        productType: kanbanRecord.product_type,
        rmaSite: kanbanRecord.rma_site,
        envType: kanbanRecord.env_type,
      });
      setButtonActive(false);
      
    }
  },[kanbanRecord]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper, // Background color
        color: theme.palette.text.primary, // Text color
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Create Kanban Information
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="RMA SITE"
              name="rmaSite"
              value={formValues.rmaSite}
              disabled={!buttonActive}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                style: {
                  color: theme.palette.text.primary, // Input text color
                },
              }}
              InputLabelProps={{
                style: {
                  color: theme.palette.text.secondary, // Input label color
                },
              }}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.text.secondary, // Input border color
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main, // Input border color on hover
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Kanban Name"
              name="kanbanName"
              value={formValues.kanbanName}
              onChange={handleChange}
              disabled={!buttonActive}
              variant="outlined"
              InputProps={{
                style: {
                  color: theme.palette.text.primary, // Input text color
                },
              }}
              InputLabelProps={{
                style: {
                  color: theme.palette.text.secondary, // Input label color
                },
              }}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.text.secondary, // Input border color
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main, // Input border color on hover
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product Type"
              name="productType"
              value={formValues.productType}
              onChange={handleChange}
              disabled={!buttonActive}
              variant="outlined"
              InputProps={{
                style: {
                  color: theme.palette.text.primary, // Input text color
                },
              }}
              InputLabelProps={{
                style: {
                  color: theme.palette.text.secondary, // Input label color
                },
              }}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.text.secondary, // Input border color
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main, // Input border color on hover
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Env Type</InputLabel>
              <Select
                label="Env Type"
                name="envType"
                value={formValues.envType}
                onChange={handleChange}
                disabled={!buttonActive}
                MenuProps={{
                  PaperProps: {
                    style: {
                      color: theme.palette.text.primary, // Dropdown text color
                    },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.text.secondary, // Dropdown border color
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main, // Dropdown border color on hover
                  },
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="PRO">PRO</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={!buttonActive}
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark" ? "#4caf50" : "#1976d2", // Button color based on mode
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#388e3c" : "#115293", // Button hover color based on mode
                  boxShadow: `0px 4px 6px ${theme.palette.primary.main}`, // Button shadow on hover
                },
                display:!buttonActive?"none":"block",
              }}
            >
              Submit
            </Button>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={buttonActive}
              onClick={() => setActiveStep(1)}
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark" ? "#4caf50" : "#1976d2", // Button color based on mode
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#388e3c" : "#115293", // Button hover color based on mode
                  boxShadow: `0px 4px 6px ${theme.palette.primary.main}`, // Button shadow on hover
                },
                display:buttonActive?"none":"block",
              }}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default KanbanForm;
