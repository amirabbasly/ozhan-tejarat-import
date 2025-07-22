import { useEffect } from "react";
import { useCompany } from "../context/CompanyContext";
import axiosInstance from "../utils/axiosInstance";

export const useFetchCompany = () => {
  const { setCompany } = useCompany();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axiosInstance.get("/accounts/company/");
        setCompany(res.data.results?.[2]);
      } catch (error) {
        console.error("خطا در گرفتن اطلاعات شرکت:", error);
      }
    };

    fetchCompany();
  }, []);
};
