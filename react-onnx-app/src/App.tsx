import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import CustomImageList from "./components/CustomImageList";
import CustomAppbar from "./components/CustomAppbar";
import AddContentFab from "./components/AddContentFab";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8a43c1",
    },
    secondary: {
      main: "#375ee8",
    },
    background: {
      default: "#353434",
      paper: "#525252",
    },
  },
  spacing: 8,
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CustomAppbar />
      <CustomImageList />
      <AddContentFab />
    </ThemeProvider>
  );
}

export default App;
