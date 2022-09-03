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
  VStack,
  Box,
  Flex,
  Heading,
  Checkbox,
  Text,
  Input,
  Center,
} from "@chakra-ui/react";
import { Member } from "../../utils/fetcher";
import {
  Event,
  BillingForm,
  FormMode,
} from "../../machines/billings/billingMachine";

type Props = {
  members: Member[];
  formMode: FormMode;
  billingForm: BillingForm;
  send: (event: Event) => void;
};

const BillingFormSecondStep = ({
  members,
  formMode,
  send,
  billingForm,
}: Props) => {
  const handleCloseForm = () => {
    send({ type: "CANCEL_FILL_FORM" });
  };

  const filteredMembers = members.filter(
    (member) => member.id !== billingForm.charged_member_id
  );

  const defaultCheckedMembers = filteredMembers.map((_) => false);

  const [checkedMembers, setCheckedMembers] = React.useState(
    defaultCheckedMembers
  );

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
          <Flex justifyContent="space-between">
            <Flex>
              <Text size="md" mr="2">
                Total Bill
              </Text>
              <Text fontWeight="bold">Rp. {billingForm.bill_amount}</Text>
            </Flex>
            <Checkbox
              size="lg"
              colorScheme="cyan"
              isChecked={billingForm.is_bill_equally}
              onChange={(event) =>
                send({
                  type: "UPDATE_FORM",
                  billingForm: {
                    ...billingForm,
                    is_bill_equally: event.target.checked,
                  },
                })
              }
            >
              Bill Equally
            </Checkbox>
          </Flex>
          <VStack spacing="4" my="4">
            {filteredMembers.map((member, index) => (
              <Box
                key={member.id}
                border="1px"
                borderRadius="16px"
                p="6"
                w="full"
                backgroundColor="gray.700"
              >
                <Flex justifyContent="space-between">
                  <Box>
                    <Text>{member.name}</Text>
                    {!billingForm.is_bill_equally && checkedMembers[index] && (
                      <Input
                        type="number"
                        placeholder="Input the amount of bill"
                        borderColor="whiteAlpha.600"
                        mt="2"
                        value={billingForm.members[index]?.amount}
                        onChange={(event) => {
                          billingForm.members[index].amount =
                            event.target.valueAsNumber;
                          send({ type: "UPDATE_FORM", billingForm });
                        }}
                      />
                    )}
                  </Box>
                  <Center>
                    <Checkbox
                      size="lg"
                      colorScheme="blue"
                      isChecked={checkedMembers[index]}
                      onChange={(event) => {
                        const { checked } = event.target;
                        setCheckedMembers((prevCheckMember) => {
                          const newMembers = prevCheckMember.map(
                            (checkedMember, currentIndex) =>
                              currentIndex === index ? checked : checkedMember
                          );

                          return newMembers;
                        });
                      }}
                    />
                  </Center>
                </Flex>
              </Box>
            ))}
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Button
            onClick={() => {
              send({ type: "PREV_STEP" });
            }}
            mr="4"
          >
            Previous Step
          </Button>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              const selectedMembers =
                formMode === FormMode.Create
                  ? filteredMembers.map((member, index) => {
                      const selectedMember = checkedMembers[index]
                        ? member.id
                        : "";
                      return {
                        id: selectedMember,
                        amount: 0,
                      };
                    })
                  : billingForm.members.filter(
                      (member, index) =>
                        checkedMembers[index] && member.id !== ""
                    );

              send({
                type: "UPDATE_FORM",
                billingForm: {
                  ...billingForm,
                  members: selectedMembers,
                },
              });
            }}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BillingFormSecondStep;
