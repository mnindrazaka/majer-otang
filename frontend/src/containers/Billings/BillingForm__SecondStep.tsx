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
import { Member, BillingDetail } from "../../utils/fetcher";
import {
  Event,
  BillingForm,
  FormMode,
} from "../../machines/billings/billingMachine";

type Props = {
  formMode: FormMode;
  members: Member[];
  billingForm: BillingForm;
  billingDetail?: BillingDetail;
  send: (event: Event) => void;
};

const BillingFormSecondStep = ({
  formMode,
  members,
  send,
  billingDetail,
  billingForm,
}: Props) => {
  const defaultValueState =
    formMode === FormMode.Create ? billingForm : billingDetail;

  const [isBillEqual, setIsBillEqual] = React.useState(
    defaultValueState?.is_bill_equally
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
          <Flex justifyContent="space-between">
            <Heading size="md">Total Bill</Heading>
            <Checkbox
              size="lg"
              colorScheme="cyan"
              isChecked={isBillEqual}
              onChange={(event) => setIsBillEqual(event.target.checked)}
            >
              Bill Equally
            </Checkbox>
          </Flex>
          <VStack spacing="4" my="4">
            {members.map((member, index) => (
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
                    {!isBillEqual && (
                      // Todo => Handle the input state
                      <Input
                        type="number"
                        placeholder="Input the amount of bill"
                        borderColor="whiteAlpha.600"
                        mt="2"
                      />
                    )}
                  </Box>
                  <Center>
                    {/* Todo => Handle the checkbox state */}
                    <Checkbox size="lg" colorScheme="blue" />
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
              send({ type: "UPDATE_FORM", billingForm });
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
