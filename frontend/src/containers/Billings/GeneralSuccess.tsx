import React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
} from "@chakra-ui/react";

type Props = {
  content: string;
  onOk: () => void;
};

const GeneralSuccess = ({ content, onOk }: Props) => {
  const cancelRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onOk}
      isOpen={true}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Success</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>{content}</AlertDialogBody>
        <AlertDialogFooter>
          <Button colorScheme="cyan" ml={3} onClick={onOk}>
            OK
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GeneralSuccess;
