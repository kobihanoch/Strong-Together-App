import { Notifier, NotifierComponents } from 'react-native-notifier';

export function showErrorAlert(title: string, description: string): void {
  Notifier.showNotification({
    title,
    description,
    Component: NotifierComponents.Alert,
    componentProps: {
      alertType: 'error',
    },
    duration: 4000,
    showAnimationDuration: 300,
    hideOnPress: true,
  });
}
