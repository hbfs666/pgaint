import "./App.css";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { ColorModeContext, useMode } from "./theme/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DynamicRouter from "./routers/DynamicRouter";
import { KanbanProvider } from "./context/KanbanContext";
import { ErrorProvider } from "./context/ErrorHandlerContext";
const queryClient = new QueryClient();

function App() {
  const [theme, colorMode] = useMode();
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorProvider>
        <KanbanProvider>
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <DynamicRouter />
            </ThemeProvider>
          </ColorModeContext.Provider>
        </KanbanProvider>
      </ErrorProvider>
    </QueryClientProvider>
  );
}

export default App;
