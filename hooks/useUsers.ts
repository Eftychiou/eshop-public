import { Api, User } from '@/my-api';
import { useEffect, useState } from 'react';

export const useUsers = () => {
  const [users, setUsers] = useState<Array<User>>([]);

  const fetchUsers = () => {
    Api.getUsers()
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, refetchUsers: fetchUsers };
};
