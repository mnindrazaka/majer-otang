import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from "@chakra-ui/react";
import { match } from "ts-pattern";
import { MachineEvents, State } from "../../machines/paymentMachine";

interface ConfirmationModalProps {
  send: (event: MachineEvents) => void;
  state: State.t;
}

const ConfirmationModal = ({ send, state }: ConfirmationModalProps) => {
  const description = match(state)
    .with(
      { value: "confirmingPayment" },
      () => "Are you sure you have already paid?"
    )
    .with({ value: "submittingPayment" }, () => "Submitting...")
    .with(
      { value: "submittingPaymentError" },
      () => " Submitting failed, do you want to try again ?"
    )
    .otherwise(() => "");

  const isLoading = match(state)
    .with({ value: "submittingPayment" }, () => true)
    .otherwise(() => false);

  const isDisabled = match(state)
    .with({ value: "submittingPayment" }, () => true)
    .otherwise(() => false);

  const submitEvent = match<State.t, MachineEvents>(state)
    .with({ value: "confirmingPayment" }, () => ({ type: "CONFIRM_PAYMENT" }))
    .with({ value: "submittingPaymentError" }, () => ({
      type: "RESUBMIT_PAYMENT"
    }))
    .otherwise(() => ({ type: "RESUBMIT_PAYMENT" }));

  return (
    <Modal isOpen onClose={() => send({ type: "CANCEL_PAYMENT" })}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign={"center"}>Payment Confirmation</ModalHeader>
        <ModalBody>
          <Text fontSize={"xl"}>{description}</Text>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            isDisabled={isDisabled}
            isLoading={isLoading}
            onClick={() => send(submitEvent)}
          >
            Submit
          </Button>
          <Button
            colorScheme="red"
            isDisabled={isDisabled}
            onClick={() => send({ type: "CANCEL_PAYMENT" })}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
