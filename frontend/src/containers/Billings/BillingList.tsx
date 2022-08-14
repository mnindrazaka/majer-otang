import React from "react";
import { Box, Flex, Heading, VStack, Text, Button } from "@chakra-ui/react";
import { Billing } from "../../utils/fetcher";
import {
  FormMode,
  MachineEvents,
} from "../../machines/billings/billingMachine";

type Props = {
  billings: Billing[];
  send: (event: MachineEvents) => void;
};

const BillingList = ({ billings, send }: Props) => {
  const handleCreateForm = () => {
    send({ type: "ACTIVATE_BILLING_FORM", formMode: FormMode.Create });
  };

  return (
    <Box m="4" color="gray.200" mb="36">
      <Heading as="h3" textAlign="center" my="6" color="gray.700">
        Billings
      </Heading>
      <VStack spacing="4">
        {billings.map((billing) => (
          <Box
            key={billing.id}
            border="1px"
            borderRadius="16px"
            p="6"
            w="full"
            backgroundColor="gray.700"
            display="flex"
            justifyContent="space-between"
          >
            <Box>
              <Text fontSize="2xl" fontWeight="semibold">
                {billing.title}
              </Text>
              <Text>{`Rp ${billing.amount}`}</Text>
            </Box>
            <Button colorScheme="telegram">Edit</Button>
          </Box>
        ))}
      </VStack>
      <Flex minWidth="max-content" alignItems="center" justify="end" py="4">
        <Button colorScheme="blue" justifySelf="end" onClick={handleCreateForm}>
          Create
        </Button>
      </Flex>
    </Box>
  );
};

export default BillingList;
