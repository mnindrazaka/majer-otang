import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
} from "@chakra-ui/react";
import { Member } from "../../utils/fetcher";
import { Event, BillingForm } from "../../machines/billings/billingMachine";

type Props = {
  billingForm: BillingForm;
  members: Member[];
  send: (event: Event) => void;
};

const BillingFormFirstStep = ({ members, send, billingForm }: Props) => {
  const handleCloseForm = () => {
    send({ type: "CANCEL_FILL_FORM" });
  };

  const { title, billAmount, chargedMemberId } = billingForm;

  const [isTitleError, isBillAmountError, isChargedMemberIdError] = [
    title === "",
    billAmount === 0,
    chargedMemberId === "",
  ];

  return (
    <Modal isOpen={true} onClose={handleCloseForm} isCentered>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent>
        <ModalHeader textAlign="center">Billing Form</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl isRequired isInvalid={isTitleError}>
            <FormLabel>Title</FormLabel>
            <Input
              placeholder="Please kindly fill the billing title"
              value={title}
              onChange={(event) =>
                send({
                  type: "UPDATE_FORM",
                  billingForm: {
                    ...billingForm,
                    title: event.target.value,
                  },
                })
              }
            />
            {isTitleError && (
              <FormErrorMessage>Title Required</FormErrorMessage>
            )}
          </FormControl>

          <FormControl mt={4} isRequired isInvalid={isBillAmountError}>
            <FormLabel>Total</FormLabel>
            <Input
              type="number"
              placeholder="Please kindly fill the billing total"
              value={billAmount}
              onChange={(event) =>
                send({
                  type: "UPDATE_FORM",
                  billingForm: {
                    ...billingForm,
                    billAmount: event.target.valueAsNumber,
                  },
                })
              }
            />
            {isBillAmountError && (
              <FormErrorMessage>Total not allowed 0</FormErrorMessage>
            )}
          </FormControl>

          <FormControl mt={4} isRequired isInvalid={isChargedMemberIdError}>
            <FormLabel>Charged Member</FormLabel>
            <Select
              value={chargedMemberId}
              placeholder="Select Member"
              onChange={(event) =>
                send({
                  type: "UPDATE_FORM",
                  billingForm: {
                    ...billingForm,
                    chargedMemberId: event.target.value,
                  },
                })
              }
            >
              {members.map((member: Member) => (
                <option value={member.id} key={member.id}>
                  {member.name}
                </option>
              ))}
            </Select>
            {isChargedMemberIdError && (
              <FormErrorMessage>Charged Member Required</FormErrorMessage>
            )}
          </FormControl>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Button onClick={handleCloseForm} mr="4">
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            mr={3}
            disabled={
              isTitleError || isBillAmountError || isChargedMemberIdError
            }
            onClick={() => send({ type: "NEXT_STEP" })}
          >
            Next
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BillingFormFirstStep;
