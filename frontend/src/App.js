import AppRoutes from "./routes/AppRoutes";
import { CompanyProvider } from "./context/CompanyContext";
import CompanyInitializer from "./components/CompanyInitializer";

const App = () => {
  return (
    <CompanyProvider>
      <CompanyInitializer />
      <AppRoutes />
    </CompanyProvider>
  );
};

export default App;
