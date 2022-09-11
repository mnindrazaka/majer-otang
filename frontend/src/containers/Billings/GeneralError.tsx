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
  errorMessage: string;
  onRefetch: () => void;
};

const GeneralError = ({ errorMessage, onRefetch }: Props) => {
  const cancelRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={() => {}}
      isOpen={true}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Oops there was something wrong</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>{errorMessage}</AlertDialogBody>
        <AlertDialogFooter>
          <Button colorScheme="cyan" ml={3} onClick={onRefetch}>
            Retry
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GeneralError;
