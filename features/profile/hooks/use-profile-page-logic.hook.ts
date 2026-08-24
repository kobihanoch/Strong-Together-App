import { useAuth } from '../../auth/shared/providers/AuthProvider';
import { getDaysSince } from '../../home/utils/home-page.utils';

const useProfilePageLogic = () => {
  const { user, setUser } = useAuth();
  const username = user?.username ?? '';
  const email = user?.email ?? '';
  const fullName = user?.name ?? '';
  const gender = user?.gender ?? '';
  const createdAtDate = user?.createdAt?.split('T')[0] ?? '';
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
