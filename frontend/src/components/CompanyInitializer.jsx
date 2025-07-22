import { useFetchCompany } from "../hooks/useFetchCompany";

const CompanyInitializer = () => {
  useFetchCompany();
  return null; // فقط initialize می‌کنه
};

export default CompanyInitializer;
