import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button
} from "@chakra-ui/react";
import React from "react";

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
