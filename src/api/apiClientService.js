import apiClient from "./apiClient";


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

export const getBodyCategorySettings = async(mappingKey)=>{
    const response=await apiClient.get("/kanbanSetting/KanbanBodyCategories?mappingKey="+mappingKey)
    return response.data
}

export const createOrupdateHeaderCategorySettings = async(mappingKey,categoryId,groupName,groupCondition,categorySequence,stationList,categoryType)=>{
    const payload = {
        mappingKey: String(mappingKey),
        categoryId: String(categoryId),
        groupName: String(groupName),
        groupCondition: String(groupCondition),
        categorySequence: String(categorySequence),
        stationList: String(stationList),
        categoryType:String(categoryType)
    };
    const response = await apiClient.post("/kanbanSetting/KanbanHeaderCategoryInsertOrUpdate",payload)
    return response.data
}

export const createOrupdateBodyCategorySettings = async(mappingKey,categoryId,groupName,groupCondition,categorySequence,stationList,categoryName,groupSequence,categoryType)=>{
    const payload = {
        mappingKey: String(mappingKey),
        categoryId: String(categoryId),
        groupName: String(groupName),
        groupCondition: String(groupCondition),
        categorySequence: String(categorySequence),
        stationList: String(stationList),
        categoryName:String(categoryName),
        groupSequence:String(groupSequence),
        categoryType:String(categoryType)
    };
    const response = await apiClient.post("/kanbanSetting/KanbanBodyCategoryInsertOrUpdate",payload)
    return response.data
}

export const getActiveCategorySetting = async(categoryId)=>{
    const response = await apiClient.get("/kanban/get/categorySetting/active?categoryId="+categoryId)
    return response.data
}

export const createOrUpdateCategorySettings = async(id, categoryId, stationRange,exclude) =>{
    const payload ={
        id:String(id),
        category_id:String(categoryId),
        station_range:String(stationRange),
        exclude:String(exclude)
    };
    const response = await apiClient.post("/kanbanSetting/KanbanCategoryInsertOrUpdate",payload)
    return response.data
}

export const deleteCategorySetting = async(id) =>{
    const response = await apiClient.post("/kanbanSetting/KanbanCategorySettingDelete?id="+id)
    return response.data
}

export const deleteCategoryGroupSetting = async(categoryId)=>{
    const response = await apiClient.post("/kanbanSetting/KanbanCategoryGroupSettingDelete?category_id="+categoryId)
    return response.data
}

export const activeKanban = async(mappingKey)=>{
    const response = await apiClient.post("/kanbanSetting/activeKanban?mappingKey="+mappingKey)
    return response.data
}

export const inActiveKanban = async(mappingKey)=>{
    const response = await apiClient.post("/kanbanSetting/inActiveKanban?mappingKey="+mappingKey)
    return response.data
}

export const deleteKanban = async(mappingKey)=>{
    const response = await apiClient.post("/kanbanSetting/deleteKanban?mappingKey="+mappingKey)
    return response.data
}

export const updateKanbanSetting = async(mappingKey,kanbanName,productType,rmaSite,envType)=>{
    const payload = {
        mappingKey:String(mappingKey),
        kanbanName:String(kanbanName),
        productType:String(productType),
        rmaSite:String(rmaSite),
        envType:String(envType)
    };
    const response = await apiClient.post("/kanbanSetting/kanbanUpdate",payload)
    return response.data
}

export const getKanbanSetting = async(mappingKey) =>{
    const response = await apiClient.get("/kanbanSetting/kanbanSetting?mappingKey="+mappingKey)
    return response.data
}

export const getKanbanRecord = async(mappingKey) =>{
    const response = await apiClient.get("/kanban/record/get?mappingKey="+mappingKey)
    return response.data
}

export const getKanbanHistoryRecord = async(mappingKey,date)=>{
    const response = await apiClient.get("/kanban/record/history/get?mappingKey="+mappingKey+"&date="+date)
    return response.data
}