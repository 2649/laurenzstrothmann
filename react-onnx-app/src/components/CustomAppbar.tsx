import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import { theme } from "../App";

export default function CustomAppbar() {
  return (
    <AppBar
      sx={{
        position: "sticky",
        bottom: "auto",
        top: 0,
        padding: 2,
        background: theme.palette.secondary.main,
      }}
    >
      <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
        Welcome!
      </Typography>
    </AppBar>
  );
}
