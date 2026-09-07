import { CreateUserBody } from '@strong-together/shared';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../services/register.service';
import { showSuccessAlert } from '../../../shared/alerts/success-alerts';

/**
 * Handles user registration flow and notifies the user to verify their account.
 */
export const useRegister = () => {
  const register = useMutation({
    mutationFn: async (payload: CreateUserBody) => {
      await registerUser(payload.email, payload.password, payload.username, payload.fullName, payload.gender);
    },
    onSuccess: (_, variables) => {
      showSuccessAlert('Please verify your account', `An email has been sent to ${variables.email}`);
    },
  });

  return {
    loadingStates: {
      isPending: register.isPending,
    },
    actions: {
      register: register.mutateAsync,
    },
  };
};
