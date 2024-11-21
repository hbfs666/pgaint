import React, { createContext, useContext,useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllActiveKanban,getAllInactiveKanban } from '../../api/apiClientService';
import Loader from '../../components/Loader';

// Create a context
const KanbanContext = createContext();

// Custom hook to use the Kanban context
export const useKanbanContext = () => useContext(KanbanContext);

// Create a provider component
export const KanbanProvider = ({ children }) => {
  const { data:activeData, isLoading, error,refetch: refetchActive } = useQuery({
    queryKey: ['kanbanActive'],
    queryFn: getAllActiveKanban,
  });

  const {data:inactiveData,isLoading:inavtiveDataIsloading,error:inactiveError,refetch: refetchInactive} = useQuery({
    queryKey: ['kanbaninActive'],
    queryFn: getAllInactiveKanban, 
  });
  // Handle loading and error states
  if (isLoading||inavtiveDataIsloading) {
    return <Loader />;
  }

  if (error||inactiveError) {
    return <div>Error loading kanban data.</div>;
  }

  const reloadContext = () => {
    refetchActive();
    refetchInactive();
  };
  
  return (
    <KanbanContext.Provider value={{activeData,inactiveData,reloadContext}}>
      {children}
    </KanbanContext.Provider>
  );
};
