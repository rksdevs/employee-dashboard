import { useQuery } from "@apollo/client";
import EmployeeCard from "./employee-card";
import { GET_EMPLOYEES, GET_ME } from "../queries/employeeQueries";

const AllEmployees = ({ employeeData }) => {
  const { loading, error, data } = useQuery(GET_EMPLOYEES);
  const {
    data: userRole,
    loading: loadingUserRole,
    error: loadingError,
  } = useQuery(GET_ME, { fetchPolicy: "network-only" });

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Something went wrong - {error}</h1>;
  return (
    <>
      {!loading &&
        !error &&
        employeeData?.map?.((item) => (
          <EmployeeCard
            data={item}
            key={item?.id}
            userIsAdmin={userRole?.getUserRole?.isAdmin}
          />
        ))}
    </>
  );
};

export default AllEmployees;
