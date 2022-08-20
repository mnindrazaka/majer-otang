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
import { Member, BillingDetail } from "../../utils/fetcher";
import {
  Event,
  FormMode,
  BillingForm,
} from "../../machines/billings/billingMachine";

type Props = {
  historyEvent: Event | undefined;
  formMode: FormMode;
  billingForm: BillingForm;
  members: Member[];
  billingDetail?: BillingDetail;
  send: (event: Event) => void;
};

const BillingFormFirstStep = ({
  historyEvent,
  members,
  send,
  billingDetail,
  formMode,
  billingForm,
}: Props) => {
  const emptyBillingDetail = {
    title: "",
    bill_amount: 0,
    charged_member_id: "",
    id: "",
    is_bill_equally: true,
    members: members.map((member) => ({
      id: "",
      amount: 0,
    })),
  };

  const defaultValueState =
    formMode === FormMode.Create
      ? billingForm
      : historyEvent?.type === "PREV_STEP"
      ? billingForm
      : billingDetail;

  const [formValue, setFormValue] = React.useState(
    defaultValueState ?? emptyBillingDetail
  );

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
              value={formValue?.title}
              onChange={(event) =>
                setFormValue((prevValue) => ({
                  ...prevValue,
                  title: event.target.value,
                }))
              }
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Total</FormLabel>
            <Input
              type="number"
              placeholder="Please kindly fill the billing total"
              value={formValue?.bill_amount}
              onChange={(event) =>
                setFormValue((prevValue) => ({
                  ...prevValue,
                  bill_amount: event.target.valueAsNumber,
                }))
              }
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Charged Member</FormLabel>
            <Select
              value={formValue?.charged_member_id}
              placeholder="Select Member"
              onChange={(event) =>
                setFormValue((prevValue) => ({
                  ...prevValue,
                  charged_member_id: event.target.value,
                }))
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
            onClick={() => {
              send({ type: "NEXT_STEP" }),
                send({
                  type: "UPDATE_FORM",
                  billingForm: formValue,
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
