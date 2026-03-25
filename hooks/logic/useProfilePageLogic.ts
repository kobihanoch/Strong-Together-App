import { useAuth } from '../../context/AuthContext';
import { getDaysSince } from '../../utils/homePageUtils';

const useProfilePageLogic = () => {
  const { user, setUser } = useAuth();
  const username = user?.username ?? '';
  const email = user?.email ?? '';
  const fullName = user?.name ?? '';
  const gender = user?.gender ?? '';
  const createdAtDate = user?.created_at?.split('T')[0] ?? '';
  const daysOnline = createdAtDate ? getDaysSince(createdAtDate) : '';

  return {
    data: {
      username,
      email,
      fullName,
      gender,
      daysOnline,
    },
    setUser,
  };
};

export default useProfilePageLogic;
