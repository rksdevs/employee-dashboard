import { gql, useQuery } from "@apollo/client";

const GET_ME = gql`
  query Me {
    me {
      id
      name
      email
      isAdmin
    }
  }
`;

export const useAuth = () => {
  const { data, loading, error } = useQuery(GET_ME);
  console.log(data, "from auth");
  return { user: data?.me, loading, error };
};
