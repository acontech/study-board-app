import { toast, Toaster } from 'react-hot-toast';

export const AppToaster = Toaster;

export function useToast() {
  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    loading: (message: string) => toast.loading(message),
    dismiss: (id: string | undefined) => toast.dismiss(id),
  };
}
