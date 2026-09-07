import { useUser } from '../../../features/user/hooks/use-user.hook';
import { getDaysSince } from '../../home/utils/home-page.utils';

/**
 * Derives profile presentation data and exposes the local-user update action.
 *
 * @returns Profile display fields and the user-state setter.
 */
const useProfilePageLogic = () => {
  const {
    data: user,
    loadingStates,
    actions: { refetch, updateUser, uploadProfilePicture },
  } = useUser();
  const username = user?.username ?? '';
  const email = user?.email ?? '';
  const fullName = user?.name ?? '';
  const rawGender = user?.gender?.trim() ?? '';
  const gender = ['male', 'female'].includes(rawGender.toLowerCase()) ? rawGender : '';
  const createdAtDate = user?.createdAt?.split('T')[0] ?? '';
  const daysOnline = createdAtDate ? getDaysSince(createdAtDate) : '';
  const memberSince = user?.createdAt
    ? new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(user.createdAt))
    : '';

  return {
    data: {
      username,
      email,
      fullName,
      gender,
      daysOnline,
      memberSince,
      isVerified: user?.isVerified ?? false,
      userId: user?.id ?? '',
      profilePicPath: user?.profilePicPath ?? null,
    },
    actions: {
      updateUser,
      uploadProfilePicture,
      refreshUser: async () => {
        await refetch();
      },
    },
    loadingStates: {
      isUploadingProfilePicture: loadingStates.isUploadingProfilePicture,
    },
  };
};

export default useProfilePageLogic;
