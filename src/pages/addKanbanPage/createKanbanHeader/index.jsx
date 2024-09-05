import React, { useEffect, useState, lazy } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Box,
  useTheme,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { EditSharp, DeleteForeverSharp, ArrowOutwardSharp} from "@mui/icons-material";

import Loadable from "../../../components/Loadable";
import { useError } from "../../../context/ErrorHandlerContext";
import { useMutation } from "@tanstack/react-query";
import { getHeaderCategorySettings,createOrupdateHeaderCategorySettings } from "../../../api/apiClientService";

const StationListEditor = Loadable(lazy(() => import("../../../components/StationListEditor")));
const GroupConditionEditor = Loadable(lazy(() => import("../../../components/GroupConditionEditor")));
const CategorySettingEditor = Loadable(lazy(() => import("../../../components/CategorySettingEditor")));

const KanbanHeaderForm = ({ kanbanRecord, setActiveStep }) => {
  const theme = useTheme();
  const downXL = useMediaQuery(theme.breakpoints.down("xl"));
  const showMessage = useError();
  const [rows, setRows] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    category_id: "",
    group_name: "",
    group_condition: "",
    category_sequence: "",
    station_list: "",
  });

  // New state for Full-Screen Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleDialogOpen = (row) => {
    setSelectedRow(row);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedRow(null);
  };

  // Use useMutation for form submission
  const getHeaderSettings = useMutation({
    mutationFn: () =>
      getHeaderCategorySettings(
        //kanbanRecord.mapping_key
        4
      ),
    onMutate: () => {},
    onError: (error) => {
      showMessage("Error in creating kanban: " + error.message, "error");
    },
    onSuccess: (data) => {
      setRows(data);
      showMessage("Kanban fetched successfully", "success");
    },
  });

  // Create or update a category
  const createOrUpdateCategory = useMutation({
    mutationFn: (data) =>
      createOrupdateHeaderCategorySettings(
        //kanbanRecord.mapping_key,
        4,
        data.category_id ,
        data.group_name,
        data.group_condition,
        data.category_sequence,
        data.station_list
      ),
    onError: (error) => {
      showMessage("Error saving category: " + error.response.data, "error");
    },
    onSuccess: () => {
      showMessage("Category saved successfully", "success");
      getHeaderSettings.mutate(); // Refresh data
    },
  });

  useEffect(() => {
    if (kanbanRecord == null) {
      showMessage("Please create Kanban record ", "error");
    }
    getHeaderSettings.mutate();
  }, [kanbanRecord]);

  const handleEditOpen = (row) => {
    
    // if(kanbanRecord==null){
    //   showMessage("mapping key not found ", "error")
    //   return 
    // }
    setEditData(row);
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
  };

  const handleSave = () => {
    createOrUpdateCategory.mutate(editData);
    setIsEditOpen(false);
  };

  const handleAdd = () => {
    createOrUpdateCategory.mutate({
      category_id: "",
      group_name: editData.group_name||"",
      group_condition: editData.group_condition||"",
      category_sequence: editData.category_sequence||"",
      station_list: editData.station_list||"",
    });
    setIsEditOpen(false);
  };

  const handleDelete = (id) => {
    setRows(rows.filter((row) => row.category_id !== id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStationListChange = (stations) => {
    setEditData((prev) => ({ ...prev, station_list: stations.join("/") }));
  };

  const handleConditionChange = (conditions) => {
    setEditData((prev) => ({ ...prev, group_condition: conditions.join("/") }));
  }

  const columns = [
    { field: "category_id", headerName: "ID",flex:1,minWidth: 50,headerAlign: 'center',align: 'center'},
    { field: "group_name", headerName: "Group Name",flex:1, minWidth: 100,headerAlign: 'center',align: 'center'},
    { field: "group_condition", headerName: "Group Condition",flex:1, minWidth: 150,headerAlign: 'center',align: 'center' },
    { field: "station_list", headerName: "Station List",  flex:1, minWidth: 150,headerAlign: 'center',align: 'center' },
    { field: "category_sequence", headerName: "Category Sequence",flex:1, minWidth: 100,headerAlign: 'center',align: 'center' },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      minWidth: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <>
        <IconButton
            color="secondary"
            onClick={() => handleDialogOpen(params.row)}
          >
            <ArrowOutwardSharp sx={{ fill: theme.palette.mode === "dark" ?"white":"black" ,fontSize:'large'}}/>
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleEditOpen(params.row)}
          >
            <EditSharp sx={{ fill: "lightgreen" ,fontSize:'large'}} />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteForeverSharp sx={{ fill: "orange",fontSize:'large' }} />
          </IconButton>
          
        </>
      ),
    },
  ];

  return (
    <Box display="flex"
    justifyContent="center"
    alignItems="center"
    flexDirection="column"
    minWidth={"100%"}
    >
      
      <Button
        onClick={() =>
          handleEditOpen({
            group_name: "",
            group_condition: "",
            station_list: "",
            category_sequence: "",
          })
        }
        variant="contained"
        sx={{
          mb: 2,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        Add New
      </Button>
    <Box width={downXL?"70vw":"100%"} height="55vh" // Fixed height for DataGrid container
        >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.category_id}
        //pageSize={5}
        //rowsPerPageOptions={[5]}
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
        disableSelectionOnClick
        disableRowSelectionOnClick
        disableColumnSorting
        disableColumnResize
        //autoHeight={true}
        hideFooter

        sx={{
          "& .super-app-theme--header": {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.secondary,
          },
          "& .MuiDataGrid-cell": {
            color: theme.palette.text.primary,
          },
          minWidth: "100%",
       
        }}
      />
      
       <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => setActiveStep(2)}
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark" ? "#4caf50" : "#1976d2", // Button color based on mode
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#388e3c" : "#115293", // Button hover color based on mode
                  boxShadow: `0px 4px 6px ${theme.palette.primary.main}`, // Button shadow on hover
                },
                marginTop:"10px"
              }}
            >
              Next
            </Button>
</Box>
      <Dialog
        open={isEditOpen}
        onClose={handleEditClose}
        PaperProps={{
          style: {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            minWidth:"60vw",
            minHeight:"80vh"
          },
        }}
      >
        <DialogTitle color={ theme.palette.primary.main}  mb={"5px"} sx={{backgroundColor:"lightgreen",padding:"10px"}} border={`1px solid ${theme.palette.divider}`}>
          {editData.category_id ? "Edit Header Category Id: " : "Add Header Category"}{" "}
          {editData.category_id}
        </DialogTitle>
        <DialogContent>
          <Box  border={`1px solid ${theme.palette.divider}`} borderRadius={1} p={2} width="100%">
          <InputLabel>Group Name</InputLabel>
          <Select
            value={editData.group_name}
            onChange={(e)=>handleChange(e)}
            name="group_name"
            fullWidth
          >
            <MenuItem value="WIP">WIP</MenuItem>
            <MenuItem value="INPUT">INPUT</MenuItem>
            <MenuItem value="OUTPUT">OUTPUT</MenuItem>
          </Select>
          </Box>
          <GroupConditionEditor
            conditions={editData.group_condition?editData.group_condition.split("/"):[]}
            onConditionsChange={handleConditionChange}
            conditionsList={process.env.REACT_APP_HEADER_CONDITIONLIST.split(',')}
          />
          <StationListEditor
              stations={editData.station_list?editData.station_list.split("/"):[]}
              onStationsChange={handleStationListChange}
            />
          <TextField
            margin="dense"
            label="Category Sequence"
            name="category_sequence"
            value={editData.category_sequence}
            onChange={handleChange}
            fullWidth
            type="number"
            InputProps={{ style: { color: theme.palette.text.primary } }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleEditClose}
            sx={{ color: theme.palette.error.main, fontWeight: "bold" }}
          >
            Cancel
          </Button>
          <Button
            onClick={editData.category_id?handleSave:handleAdd}
            color="primary"
            sx={{ color: theme.palette.success.main, fontWeight: "bold" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {selectedRow&&(<CategorySettingEditor open={isDialogOpen} onClose={handleDialogClose} rowData={selectedRow} />)}
    </Box>
  );
};

export default KanbanHeaderForm;
