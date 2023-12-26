import React, { FC, useCallback } from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Flex,
} from "@strapi/design-system";
import { ExclamationMarkCircle } from "@strapi/icons";
import { Trash } from "@strapi/icons";

type DialogProps = {
  title: string;
  description?: string;
  onClose?: {
    label: string;
    function: (...args: any[]) => void;
  };
  onConfirm?: {
    label: string;
    function: (...args: any[]) => void;
  };
};

export const useConfirmationDialog = () => {
  const [dialog, setDialog] = React.useState<DialogProps>({} as DialogProps);
  const [isVisible, setIsVisible] = React.useState(false);

  const DialogComponent: FC = useCallback(() => {
    return (
      <Dialog
        onClose={() => setIsVisible(false)}
        title={dialog?.title}
        isOpen={isVisible}
      >
        <DialogBody icon={<ExclamationMarkCircle />}>
          <Flex direction="column" alignItems="center" gap={2}>
            <Flex justifyContent="center">
              <Typography id="confirm-description">
                {dialog?.description}
              </Typography>
            </Flex>
          </Flex>
        </DialogBody>
        <DialogFooter
          startAction={
            <Button
              onClick={() => {
                dialog?.onClose?.function() || setIsVisible(false);
              }}
              variant="tertiary"
            >
              {dialog?.onClose?.label}
            </Button>
          }
          endAction={
            <Button
              onClick={() => {
                dialog?.onConfirm?.function() || setIsVisible(false);
              }}
              variant="danger-light"
              startIcon={<Trash />}
            >
              {dialog?.onConfirm?.label}
            </Button>
          }
        />
      </Dialog>
    );
  }, [dialog, isVisible]);

  return { dialog, setDialog, isVisible, setIsVisible, DialogComponent };
};
