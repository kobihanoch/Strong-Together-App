import { Notifier, NotifierComponents } from 'react-native-notifier';

export function showSuccessAlert(title: string, description: string | undefined | null): void {
  description = description ? description : '';
  Notifier.showNotification({
    title: title,
    description: description,
    duration: 5000,
    showAnimationDuration: 250,
    hideOnPress: true,
    Component: NotifierComponents.Alert,
    componentProps: {
      alertType: 'success', // "success" | "warn" | "error"
      titleStyle: { fontSize: 16 },
      descriptionStyle: { fontSize: 14 },
    },
  });
}
