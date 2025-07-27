import AppRoutes from "./routes/AppRoutes";
import { CompanyProvider } from "./context/CompanyContext";
import CompanyInitializer from "./components/CompanyInitializer";

const App = () => {
  return (
    <div className="font-vazir">
      <CompanyProvider>
        <CompanyInitializer />
        <AppRoutes />
      </CompanyProvider>
    </div>
  );
};

export default App;
