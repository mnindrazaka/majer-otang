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
  Checkbox,
  Text,
  Input,
  Center,
} from "@chakra-ui/react";
import { Member } from "../../utils/fetcher";
import { Event, BillingForm } from "../../machines/billings/billingMachine";

type Props = {
  members: Member[];
  billingForm: BillingForm;
  send: (event: Event) => void;
};

const BillingFormSecondStep = ({ members, send, billingForm }: Props) => {
  const handleCloseForm = () => {
    send({ type: "CANCEL_FILL_FORM" });
  };

  const filteredMembers = members.filter(
    (member) => member.id !== billingForm.charged_member_id
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
              onChange={(event) => {
                const updatedMembers = billingForm.members.map(({ id }) => ({
                  id,
                  amount: 0,
                }));
                send({
                  type: "UPDATE_FORM",
                  billingForm: {
                    ...billingForm,
                    is_bill_equally: event.target.checked,
                    members: updatedMembers,
                  },
                });
              }}
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
                    {!billingForm.is_bill_equally &&
                      billingForm.members.some(
                        (billingMember) => billingMember.id === member.id
                      ) && (
                        <Input
                          type="number"
                          placeholder="Input the amount of bill"
                          borderColor="whiteAlpha.600"
                          mt="2"
                          value={billingForm.members[index]?.amount}
                          onChange={(event) => {
                            const updatedBillingForm = {
                              ...billingForm,
                              members: billingForm.members.map(
                                ({ id, amount }) => ({
                                  id,
                                  amount:
                                    member.id === id
                                      ? event.target.valueAsNumber
                                      : amount,
                                })
                              ),
                            };
                            send({
                              type: "UPDATE_FORM",
                              billingForm: updatedBillingForm,
                            });
                          }}
                        />
                      )}
                  </Box>
                  <Center>
                    <Checkbox
                      size="lg"
                      colorScheme="blue"
                      isChecked={billingForm.members.some(
                        (billingMember) => billingMember.id === member.id
                      )}
                      onChange={(event) => {
                        const { checked } = event.target;
                        const updatedMembers = checked
                          ? [
                              ...billingForm.members,
                              { id: member.id, amount: 0 },
                            ]
                          : billingForm.members.filter(
                              (billingMember) => billingMember.id !== member.id
                            );

                        const updatedBillingForm = {
                          ...billingForm,
                          members: updatedMembers,
                        };

                        send({
                          type: "UPDATE_FORM",
                          billingForm: updatedBillingForm,
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
          <Button colorScheme="blue" mr={3}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BillingFormSecondStep;
