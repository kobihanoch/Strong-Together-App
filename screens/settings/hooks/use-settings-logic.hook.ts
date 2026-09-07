import { useNotificationPermission } from '../../../shared/hooks/use-notification-permission.hook';

const useSettingsLogic = () => {
  const permission = useNotificationPermission();

  return {
    notificationsPermissionStatus: permission.status,
    hasNotificationsPermission: permission.isEnabled,
    checkNotificationsPermission: permission.checkPermission,
    requestNotificationsPermission: permission.requestPermission,
  };
};

export default useSettingsLogic;
