import React, { useEffect } from 'react';
import { message as antdStaticMessage, App } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';

interface ToastOptions {
  duration?: number;
  key?: string;
  onClose?: () => void;
}

let activeMessageInstance: MessageInstance = antdStaticMessage;

/**
 * Component to capture Ant Design's App context message instance.
 * Place inside Ant Design's <App> component.
 */
export const ToastConfigurator: React.FC = () => {
  const { message } = App.useApp();

  useEffect(() => {
    activeMessageInstance = message;
    return () => {
      activeMessageInstance = antdStaticMessage;
    };
  }, [message]);

  return null;
};

/**
 * Extracts a user-friendly error message from various error types
 * (AxiosError, Error, string, object).
 */
export const extractErrorMessage = (error: unknown, fallbackMessage = 'Terjadi kesalahan'): string => {
  if (!error) return fallbackMessage;

  if (typeof error === 'string') {
    return error.trim() ? error : fallbackMessage;
  }

  // Handle Axios / backend responses
  if (typeof error === 'object' && error !== null) {
    const errObj = error as Record<string, unknown>;
    const response = errObj.response as Record<string, unknown> | undefined;
    const responseData = response?.data as Record<string, unknown> | string | undefined;

    if (responseData) {
      if (typeof responseData === 'string' && responseData.trim()) {
        return responseData;
      }
      if (typeof responseData === 'object' && responseData !== null) {
        if (typeof responseData.error === 'string' && responseData.error.trim()) {
          return responseData.error;
        }
        if (typeof responseData.message === 'string' && responseData.message.trim()) {
          return responseData.message;
        }
      }
    }

    if (typeof errObj.message === 'string' && errObj.message.trim()) {
      if (errObj.message === 'Network Error') {
        return 'Gagal terhubung ke server. Periksa koneksi internet Anda.';
      }
      return errObj.message;
    }
  }

  return fallbackMessage;
};

/**
 * Centralized Toast utility for Taskfun
 */
export const toast = {
  success: (content: React.ReactNode, options?: ToastOptions) => {
    return activeMessageInstance.success({
      content,
      duration: options?.duration ?? 3,
      key: options?.key,
      onClose: options?.onClose,
    });
  },

  error: (errorOrMessage: unknown, fallbackMessage?: string, options?: ToastOptions) => {
    const content = typeof errorOrMessage === 'string' && !fallbackMessage
      ? errorOrMessage
      : extractErrorMessage(errorOrMessage, fallbackMessage);

    return activeMessageInstance.error({
      content,
      duration: options?.duration ?? 4,
      key: options?.key,
      onClose: options?.onClose,
    });
  },

  warning: (content: React.ReactNode, options?: ToastOptions) => {
    return activeMessageInstance.warning({
      content,
      duration: options?.duration ?? 3.5,
      key: options?.key,
      onClose: options?.onClose,
    });
  },

  info: (content: React.ReactNode, options?: ToastOptions) => {
    return activeMessageInstance.info({
      content,
      duration: options?.duration ?? 3,
      key: options?.key,
      onClose: options?.onClose,
    });
  },

  loading: (content: React.ReactNode, options?: ToastOptions) => {
    return activeMessageInstance.loading({
      content,
      duration: options?.duration ?? 0,
      key: options?.key,
      onClose: options?.onClose,
    });
  },

  dismiss: (key?: string) => {
    if (key) {
      activeMessageInstance.destroy(key);
    } else {
      activeMessageInstance.destroy();
    }
  },
};

export default toast;
