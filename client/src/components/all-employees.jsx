import { useQuery } from "@apollo/client";
import EmployeeCard from "./employee-card";
import { useEffect } from "react";
import { GET_EMPLOYEES } from "../queries/employeeQueries";

const AllEmployees = () => {
  const { loading, error, data } = useQuery(GET_EMPLOYEES);
  useEffect(() => {
    console.log(data);
  }, [data]);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Something went wrong - {error}</h1>;
  return (
    <>
      {!loading &&
        !error &&
        data?.allEmployees?.map?.((item) => (
          <EmployeeCard data={item} key={item?.id} />
        ))}
    </>
  );
};

export default AllEmployees;
