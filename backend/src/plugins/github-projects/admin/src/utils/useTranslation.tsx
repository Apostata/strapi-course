import { useIntl } from "react-intl";
import getTrad from "./getTrad";
import React, { FC, useCallback } from "react";

type Translation = {
  children: string;
  values?: any;
};

export const useTranlation = () => {
  const { formatMessage } = useIntl();

  const t = useCallback(
    (id: string, values?: any) => {
      if (values && !values?.name) {
        values.name = "";
      }
      if (!values) {
        values = { name: "" };
      }
      return formatMessage({ id: getTrad(id) }, values);
    },
    [formatMessage]
  );

  const Trans: FC<Translation> = useCallback(
    (props) => {
      const { children, values } = (props = { ...props });
      return <span>{t(children as string, values)}</span>;
    },
    [formatMessage]
  );
  return { t, Trans };
};
