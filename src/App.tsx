import { Container } from "@mui/material";

import { Outlet } from "react-router-dom";

function App() {
  return (
    <Container
      maxWidth="lg"
      sx={{
        height: `100%`,
        width: `100%`,
        display: "flex",
        flexDirection: "column",
        minHeight: "0",
      }}
    >
      <Outlet />
    </Container>
  );
}

export default App;
