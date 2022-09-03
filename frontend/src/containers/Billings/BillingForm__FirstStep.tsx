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
  Input,
  Select,
} from "@chakra-ui/react";
import { Member } from "../../utils/fetcher";
import {
  Event,
  BillingForm,
  FormMode,
} from "../../machines/billings/billingMachine";

type Props = {
  billingForm: BillingForm;
  formMode: FormMode;
  members: Member[];
  send: (event: Event) => void;
};

const BillingFormFirstStep = ({
  members,
  send,
  billingForm,
  formMode,
}: Props) => {
  const handleCloseForm = () => {
    send({ type: "CANCEL_FILL_FORM" });
  };

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
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              placeholder="Please kindly fill the billing title"
              value={billingForm.title}
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
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Total</FormLabel>
            <Input
              type="number"
              placeholder="Please kindly fill the billing total"
              value={billingForm.bill_amount}
              onChange={(event) =>
                send({
                  type: "UPDATE_FORM",
                  billingForm: {
                    ...billingForm,
                    bill_amount: event.target.valueAsNumber,
                  },
                })
              }
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Charged Member</FormLabel>
            <Select
              value={billingForm.charged_member_id}
              placeholder="Select Member"
              onChange={(event) =>
                send({
                  type: "UPDATE_FORM",
                  billingForm: {
                    ...billingForm,
                    charged_member_id: event.target.value,
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
          </FormControl>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Button onClick={handleCloseForm} mr="4">
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            mr={3}
            // Todo => Handle Disabled Next Button
            onClick={() => {
              send({ type: "NEXT_STEP" }),
                formMode === FormMode.Create &&
                  send({
                    type: "UPDATE_FORM",
                    billingForm: {
                      ...billingForm,
                      is_bill_equally: true,
                    },
                  });
            }}
          >
            Next
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BillingFormFirstStep;
