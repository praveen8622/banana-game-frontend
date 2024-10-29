// src/App.tsx
import { Grid, GridItem } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "./components/NavBar";
import AppRoutes from "./routes";

function App() {
  return (
    <Router>
      <Grid
        templateAreas={{
          base: `"navbar" "main"`,
          md: `"navbar navbar" "main main"`,
        }}
        gridTemplateRows="auto 1fr"
        gridTemplateColumns="1fr"
        h="100vh"
        gap="4"
      >
        <GridItem area="navbar" as="header" w="100%">
          <NavBar />
        </GridItem>
        <GridItem area="main" as="main" w="100%" p="4">
          <AppRoutes /> {/* Use the routes defined in AppRoutes */}
        </GridItem>
      </Grid>
    </Router>
  );
}

export default App;
