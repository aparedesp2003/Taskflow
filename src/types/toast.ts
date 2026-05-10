export type ToastType = "success" | "error" | "info" | "warning";

export type ToastItem = {
  id:      string;
  type:    ToastType;
  message: string;
};

export type ToastContextValue = {
  success: (message: string) => void;
  error:   (message: string) => void;
  info:    (message: string) => void;
  warning: (message: string) => void;
};
