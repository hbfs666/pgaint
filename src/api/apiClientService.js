import apiClient from "./apiClient";

export const getTodos = async () => {
  const response = await apiClient.get("/todos");
  return response.data;
}

export const getKanbanInfo = async (kanbanName, productType,rmaSite,envType)=>{
    const response = await apiClient.get("/kanbanSetting/kanban?kanbanName="+kanbanName+"&productType="+productType+"&rmaSite="+rmaSite+"&envType="+envType);
    //console.log(Object.fromEntries(JSON.stringify(response.data)))
    //console.log(JSON.stringify(response.data))
    return response.data
}

export const getAllActiveKanban = async () => {
    const response = await apiClient.get("/kanban/get/active");
    return response.data
}

export const getAllInactiveKanban = async () => {
    const response = await apiClient.get("/kanban/get/inactive");
    return response.data
}

export const createKanban = async (kanbanName, productType,rmaSite,envType)=>{
    const response = await apiClient.post("/kanban/create?kanbanName="+kanbanName+"&productType="+productType+"&rmaSite="+rmaSite+"&envType="+envType)
    return response.data
}

export const getHeaderCategorySettings = async(mappingKey)=>{
    const response = await apiClient.get("/kanbanSetting/KanbanHeaderCategories?mappingKey="+mappingKey)
    return response.data
}

export const createOrupdateHeaderCategorySettings = async(mappingKey,categoryId,groupName,groupCondition,categorySequence,stationList)=>{
    const payload = {
        mappingKey: String(mappingKey),
        categoryId: String(categoryId),
        groupName: String(groupName),
        groupCondition: String(groupCondition),
        categorySequence: String(categorySequence),
        stationList: String(stationList)
    };
    const response = await apiClient.post("/kanbanSetting/KanbanHeaderCategoryInsertOrUpdate",payload)
    return response.data
}

export const getActiveCategorySetting = async(categoryId)=>{
    const response = await apiClient.get("/kanban/get/categorySetting/active?categoryId="+categoryId)
    return response.data
}