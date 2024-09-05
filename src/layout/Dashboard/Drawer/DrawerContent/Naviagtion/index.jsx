import { useKanbanContext } from "../../../../../context/KanbanContext";
import { StopOutlined,PlayCircleOutlined } from "@ant-design/icons";
// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import NavGroup from './NavGroup';

const incons ={
    StopOutlined,
    PlayCircleOutlined
}

const transInactiveformKanban = (datas) => {
    if (!datas) return [];
    return datas.map((data) => ({
      id: data.mapping_key.toString(), // Ensure id is a string
      title: data.kanban_name.toString(),
      type: "item",
      url: `/kanban/${data.kanban_name}/${data.mapping_key}`,
      icon: incons.StopOutlined, // Ant Design Icon component
      iconColor:"red",
      breadcrumbs: true, // Assuming breadcrumbs is always true
    }));
  };

  const transActiveformKanban = (datas) => {
    if (!datas) return [];
    return datas.map((data) => ({
      id: data.mapping_key.toString(), // Ensure id is a string
      title: data.kanban_name.toString(),
      type: "item",
      url: `/kanban/${data.kanban_name}/${data.mapping_key}`,
      icon: incons.PlayCircleOutlined, // Ant Design Icon component
      iconColor:"green",
      breadcrumbs: true, // Assuming breadcrumbs is always true
    }));
  };


// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
    const kanbanData=useKanbanContext()
    const mainInactive = {
        id: "inactive_kanban",
        title: "Inactive Kanban",
        type: "group",
        children: transInactiveformKanban(kanbanData.inactiveData),
      };
    const mainActive = {
        id: "active_kanban",
        title: "Active Kanban",
        type: "group",
        children: transActiveformKanban(kanbanData.activeData),
      };

  const navGroups = [mainActive,mainInactive].map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      case 'Buttom':
        return 
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}