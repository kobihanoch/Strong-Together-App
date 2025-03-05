import { useAuth } from '../context/AuthContext';

const useUserData = () => {
  const { user } = useAuth();
  return user;
};

export default useUserData;
