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
import { MachineEvents } from "../../machines/billings/billingMachine";

type Props = {
  members: Member[];
  send: (event: MachineEvents) => void;
};

const BillingForm = ({ members, send }: Props) => {
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
            <Input placeholder="Please kindly fill the billing title" />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Total</FormLabel>
            <Input placeholder="Please kindly fill the billing total" />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Charged Member</FormLabel>
            <Select placeholder="Select option">
              {members.map((member: Member) => (
                <option value={member.id} key={member.id}>
                  {member.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleCloseForm} mr="4">
            Cancel
          </Button>
          <Button colorScheme="blue" mr={3}>
            Next
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BillingForm;
