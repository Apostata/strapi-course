import React, { Alert } from "@strapi/design-system";
import { FC, useCallback, useState } from "react";

export type Alert =
  | {
      title: string;
      message: string;
      variant: "success" | "warning" | "danger";
    }
  | undefined;

export const useAlert = () => {
  const [alert, setAlert] = useState<Alert>(undefined);

  const showAlert = (alert: Alert) => {
    setAlert(alert);
    setTimeout(() => {
      setAlert(undefined);
    }, 3000);
  };

  const AlertComponent: FC<typeof Alert> = useCallback(
    (props) => {
      if (!alert) return null;
      return (
        <Alert
          {...props}
          title={alert.title}
          message={alert.message}
          variant={alert.variant}
          onClose={() => setAlert(undefined)}
        />
      );
    },
    [alert]
  );

  return { alert, showAlert, AlertComponent };
};
