import { useQuery } from "react-query";
import { api } from "../apiClient";

type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

type GetUsersResponse = {
  totalCount: number;
  users: User[];
}

export async function getUsers(page: number): Promise<GetUsersResponse> {
  const { data, headers } = await api.get('/client', {
    params: {
      page,
    }
  });

  const totalCount = Number(headers['x-total-count']);

  const users = data.map(user => {
    return {
      id: user.id,
      name: user.username,
      email: user.email,
      created_at: new Date(user.created_at).toLocaleDateString('pt-BR', {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }),
    };
  })

  return {
    users,
    totalCount
  };
}


export function useUsers(page: number) {
  return useQuery(['users', page], () => getUsers(page));
}