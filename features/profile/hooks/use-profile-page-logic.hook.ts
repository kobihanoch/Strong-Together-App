import { useUser } from '../../auth/shared/hooks/use-user.hook';
import { getDaysSince } from '../../home/utils/home-page.utils';

const useProfilePageLogic = () => {
  const {
    data: user,
    actions: { updateLocalUser },
  } = useUser();
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
    setUser: updateLocalUser,
  };
};

export default useProfilePageLogic;
