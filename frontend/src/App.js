// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Import your pages and components
import Home from "./pages/Home";
import AddCottage from "./pages/AddCottage";
import CottageListPage from "./pages/CottageListPage";
import Navbar from "./components/Navbar";
import ImportProforma from "./pages/ImportPrf";
import CustomsDeclarationList from "./components/CustomsDeclarationList";
import CustomsDeclarationDetails from "./components/CustomsDeclarationDetails";
import CottageDetails from "./pages/CottageDetails";
import Login from "./components/login";
import RegedOrderList from "./pages/RegedOrderList";
import RegedOrderDetails from "./components/RegedOrderDetails";
import AddOrder from "./pages/AddOrder";
import RepresentationList from "./components/RepresentationList";
import RepresentationForm from "./components/RepresentationForm";
import CheckList from "./components/ChecksList";
import AddCheck from "./components/AddCheck";
import ExportCustomsDecList from "./components/ExportCustomsDecList";
import AllNotifications from "./components/AllNotifications";
import ExportCottageList from "./components/ExportCottagesList";
import AddExportCottages from "./components/AddExportCottages";
import ExportedCottageDetails from "./pages/ExportedCottageDetails";
import Chatbots from "./components/ChatBot";
import HSCodeImport from "./components/HSCodeFromExcel";
import HSCodeUpdate from "./components/HSCodeUpdate";
import HSCodeListComponent from "./components/HSCodeList";
import HSCodeInfiniteScroll from "./components/HSCodeInfiniteScroll";
import ImportComponent from "./components/ImportHeadings";
import ImportExcelCottages from "./components/ImportCottages";
import ImportRep from "./components/RepresentationImport";
import ImportCheck from "./components/CheckImport";
// Import Redux Provider and store
import { Provider } from "react-redux";
import store from "./store";
import Forbidden from "./components/Forbidden";
import CustomerCreateForm from "./components/CustomerCreateForm";
import GoodsList from "./components/GoodsList";
import TariffCalculator from "./components/TarriffCalculator";
// Import the PrivateRoute component
import PrivateRoute from "./components/PrivateRoute";
import TextOverlayForm from "./components/TextOverlayForm";
import InvoiceForm from "./components/InvoiceForm";
import SellerForm from "./components/SellerForm";
import BuyerForm from "./components/BuyerForm";
import InvoiceList from "./components/InvoiceList";
import InvoiceDetail from "./components/InvoiceDetail";
import "./App.css";
import CalendarApp from "./components/CalendarApp";
import CreateEventForm from "./components/CreateEventForm";
import ProformaInvoiceForm from "./components/ProformaInvoiceForm";
import ProformaInvoiceList from "./components/ProformaInvoiceList";
import ProformaInvoiceDetail from "./components/ProformaInvoiceDetail";
import SellerList from "./components/SellerList";
import SellerDetails from "./components/SellerDetails";
import BuyerDetails from "./components/BuyerDetails";
import BuyerList from "./components/BuyerList";
import ImportTags from "./components/ImportTags";
import CustomerList from "./components/CustomerList";
import CustomerDetails from "./components/CustomerDetails";
import RepresentationEdit from "./components/RepresentationEdit";
import ExpensesList from "./pages/CottageExpenses";
import ExpenseForm from "./pages/ExpenseForm";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

// Separate AppContent to use useLocation
function AppContent() {
  const location = useLocation();

  // List of paths where the Navbar should not be displayed
  const noNavbarRoutes = ["/login"];

  return (
    <>
      {/* Conditionally render Navbar */}
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}

      <main>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/forbidden" element={<Forbidden />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications/all"
            element={
              <PrivateRoute>
                <AllNotifications />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-cottage"
            element={
              <PrivateRoute>
                <AddCottage />
              </PrivateRoute>
            }
          />
          <Route
            path="/cottages"
            element={
              <PrivateRoute>
                <CottageListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/cottage-from-excel"
            element={
              <PrivateRoute>
                <ImportExcelCottages />
              </PrivateRoute>
            }
          />
          <Route
            path="/rep-from-excel"
            element={
              <PrivateRoute>
                <ImportRep />
              </PrivateRoute>
            }
          />
          <Route
            path="/export-cottages"
            element={
              <PrivateRoute>
                <ExportCottageList />
              </PrivateRoute>
            }
          />
          <Route
            path="/reged-orders"
            element={
              <PrivateRoute>
                <RegedOrderList />
              </PrivateRoute>
            }
          />
          <Route
            path="/import-prf"
            element={
              <PrivateRoute requiredRole="admin">
                <ImportProforma />
              </PrivateRoute>
            }
          />
          <Route
            path="/declarations/:FullSerialNumber"
            element={
              <PrivateRoute>
                <CustomsDeclarationDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/decl"
            element={
              <PrivateRoute requiredRole="admin">
                <CustomsDeclarationList />
              </PrivateRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <PrivateRoute requiredRole="admin">
                <Chatbots />
              </PrivateRoute>
            }
          />
          <Route
            path="/export-decl"
            element={
              <PrivateRoute requiredRole="admin">
                <ExportCustomsDecList />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-order"
            element={
              <PrivateRoute>
                <AddOrder />
              </PrivateRoute>
            }
          />
          <Route
            path="/order-details/:prf_order_no"
            element={
              <PrivateRoute>
                <RegedOrderDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/cottages/:cottageNumber"
            element={
              <PrivateRoute>
                <CottageDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/cottage-goods-list"
            element={
              <PrivateRoute>
                <GoodsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/export-cottages/:fullSerialNumber"
            element={
              <PrivateRoute>
                <ExportedCottageDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/representations"
            element={
              <PrivateRoute>
                <RepresentationList />
              </PrivateRoute>
            }
          />
          <Route
            path="/representations/:id/edit"
            element={
              <PrivateRoute>
                <RepresentationEdit />
              </PrivateRoute>
            }
          />
          <Route
            path="/checks"
            element={
              <PrivateRoute>
                <CheckList />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-check"
            element={
              <PrivateRoute>
                <AddCheck />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-export"
            element={
              <PrivateRoute>
                <AddExportCottages />
              </PrivateRoute>
            }
          />
          <Route
            path="/hscode-import"
            element={
              <PrivateRoute>
                <HSCodeImport />
              </PrivateRoute>
            }
          />
          <Route
            path="/check-from-excel"
            element={
              <PrivateRoute>
                <ImportCheck />
              </PrivateRoute>
            }
          />
          <Route
            path="/import-headings"
            element={
              <PrivateRoute>
                <ImportComponent
                  endpoint="/customs/import-headings/"
                  title="Import Headings"
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/import-subheadings"
            element={
              <PrivateRoute>
                <ImportComponent
                  endpoint="/customs/import-subheadings/"
                  title="Import SubHeadings"
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/import-seasons"
            element={
              <PrivateRoute>
                <ImportComponent
                  endpoint="/customs/import-seasons/"
                  title="Import Seasons"
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/expense-list"
            element={
              <PrivateRoute>
                <ExpensesList />
              </PrivateRoute>
            }
          />
          <Route
            path="/new-expense"
            element={
              <PrivateRoute>
                <ExpenseForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/hscode-update"
            element={
              <PrivateRoute>
                <HSCodeUpdate />
              </PrivateRoute>
            }
          />

          <Route
            path="/hscode-list"
            element={
              <PrivateRoute>
                <HSCodeListComponent />
              </PrivateRoute>
            }
          />

          <Route
            path="/import-tags"
            element={
              <PrivateRoute>
                <ImportTags />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/new"
            element={
              <PrivateRoute>
                <CustomerCreateForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/list"
            element={
              <PrivateRoute>
                <CustomerList />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/details/:customerId"
            element={
              <PrivateRoute>
                <CustomerDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/hscode-inf"
            element={
              <PrivateRoute>
                <HSCodeInfiniteScroll />
              </PrivateRoute>
            }
          />

          <Route
            path="/add-representation"
            element={
              <PrivateRoute>
                <RepresentationForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/tariff-calculator"
            element={
              <PrivateRoute>
                <TariffCalculator />
              </PrivateRoute>
            }
          />
          <Route
            path="/certificate-of-origin"
            element={
              <PrivateRoute>
                <TextOverlayForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoices/new"
            element={
              <PrivateRoute>
                <InvoiceForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/proforma-invoices/new"
            element={
              <PrivateRoute>
                <ProformaInvoiceForm />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/sellers/new"
            element={
              <PrivateRoute>
                <SellerForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/buyers/new"
            element={
              <PrivateRoute>
                <BuyerForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoices/list"
            element={
              <PrivateRoute>
                <InvoiceList />
              </PrivateRoute>
            }
          />
          <Route
            path="/proforma-invoices/list"
            element={
              <PrivateRoute>
                <ProformaInvoiceList />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoices/details/:invoiceNumber"
            element={
              <PrivateRoute>
                <InvoiceDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/proforma-invoices/details/:invoiceNumber"
            element={
              <PrivateRoute>
                <ProformaInvoiceDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <CalendarApp />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <PrivateRoute>
                <CreateEventForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/sellers/list"
            element={
              <PrivateRoute>
                <SellerList />
              </PrivateRoute>
            }
          />
          <Route
            path="/sellers/details/:sellerId"
            element={
              <PrivateRoute>
                <SellerDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/buyers/list"
            element={
              <PrivateRoute>
                <BuyerList />
              </PrivateRoute>
            }
          />
          <Route
            path="/buyers/details/:buyerId"
            element={
              <PrivateRoute>
                <BuyerDetails />
              </PrivateRoute>
            }
          />
          {/* Add more protected routes as needed */}
        </Routes>
      </main>
    </>
  );
}

export default App;
