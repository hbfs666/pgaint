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
import { useKanbanContext } from "../../../context/KanbanContext";

const rmaSites = process.env.REACT_APP_APP_RMASITE.split(",");
const productTypes = process.env.REACT_APP_PRODUCT_TYPELIST.split(",");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const KanbanForm = ({ setKanbanRecord, kanbanRecord, setActiveStep }) => {
  const showMessage = useError();
  const [formValues, setFormValues] = useState({
    kanbanName: "",
    productType: "",
    rmaSite: "",
    envType: "",
  });

  const [buttonActive, setButtonActive] = useState(true);

  const theme = useTheme(); // Get the current theme

  const { reloadContext } = useKanbanContext();

  // Use useMutation for form submission
  const mutation = useMutation({
    mutationFn: () =>
      createKanban(
        formValues.kanbanName,
        formValues.productType,
        formValues.rmaSite,
        "PRO"
      ),
    onMutate: () => {
      setButtonActive(false); // Disable the button while loading
    },
    onError: (error) => {
      showMessage("Error in creating kanban: " + error.message, "error");
      setButtonActive(true); // Re-enable the button if there's an error
    },
    onSuccess: async(data) => {
      setButtonActive(false);
      showMessage("Kanban created successfully", "success");
      reloadContext();
      setKanbanRecord(data);
      //sleep(400)
      //setActiveStep(1);
    },
  });

  useEffect(() => {
    if (kanbanRecord != null) {
      setFormValues({
        kanbanName: kanbanRecord.kanban_name,
        productType: kanbanRecord.product_type,
        rmaSite: kanbanRecord.rma_site,
        envType: kanbanRecord.env_type,
      });
      setButtonActive(false);
    }
  }, [kanbanRecord]);

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
      <form onSubmit={handleSubmit} id="create-kanban">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" disabled={!buttonActive}>
              <InputLabel
                id="rmaSite-label"
                style={{ color: theme.palette.text.secondary }}
              >
                RMA SITE
              </InputLabel>
              <Select
                labelId="rmaSite-label"
                id="rmaSite"
                name="rmaSite"
                value={formValues.rmaSite}
                onChange={handleChange}
                label="RMA SITE"
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.text.secondary, // Input border color
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main, // Input border color on hover
                  },
                }}
                inputProps={{
                  style: {
                    color: theme.palette.text.primary, // Input text color
                  },
                }}
              >
                {rmaSites.map((site) => (
                  <MenuItem key={site} value={site}>
                    {site}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
              id="kanbanName"
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
            <FormControl fullWidth variant="outlined" disabled={!buttonActive}>
              <InputLabel
                id="productType-label"
                style={{ color: theme.palette.text.secondary }}
              >
                Product Type
              </InputLabel>
              <Select
                labelId="productType-label"
                id="productType"
                name="productType"
                value={formValues.productType}
                onChange={handleChange}
                label="Product Type"
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.text.secondary, // Input border color
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main, // Input border color on hover
                  },
                }}
                inputProps={{
                  style: {
                    color: theme.palette.text.primary, // Input text color
                  },
                }}
              >
                {productTypes.map((site) => (
                  <MenuItem key={site} value={site}>
                    {site == "L11"
                      ? "MAC (L11)"
                      : site == "L7"
                      ? "WATCH (L7)"
                      : site == "L5"
                      ? "PHONE (L5)"
                      : site}
                  </MenuItem>
                ))}
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
                display: !buttonActive ? "none" : "block",
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
                backgroundColor: "#4caf50", // Button color based on mode
                "&:hover": {
                  backgroundColor: theme.palette.mode === "#388e3c", // Button hover color based on mode
                  boxShadow: `0px 4px 6px ${theme.palette.primary.main}`, // Button shadow on hover
                },
                display: buttonActive ? "none" : "block",
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
