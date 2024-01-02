import React, { FC, ElementType } from "react";
import { Typography, Flex, Button, Box } from "@strapi/design-system";

type Action = {
  label: string;
  icon?: React.ReactNode;
  variant?: string;
  show?: boolean;
  function: (...args: any[]) => void;
};

type BulkActionsProps<T> = {
  selectedItems: T[];
  text: string;
  actions: Action[];
};

const BulkActions = <T,>({
  selectedItems,
  text,
  actions,
}: BulkActionsProps<T>) => {
  return (
    <>
      {selectedItems.length > 0 && (
        <Box>
          <Flex>
            <Box marginRight={2}>
              <Typography variant="body" textColor={"neutral600"}>
                {text}
              </Typography>
            </Box>
            <>
              {actions.map((action) => {
                return (
                  <Button
                    marginLeft={2}
                    key={action.label}
                    variant={action.variant || "primary"}
                    endIcon={action.icon}
                    onClick={action.function}
                    style={{ display: action.show ? "flex" : "none" }}
                  >
                    {action.label}
                  </Button>
                );
              })}
            </>
          </Flex>
        </Box>
      )}
    </>
  );
};

export default BulkActions;
