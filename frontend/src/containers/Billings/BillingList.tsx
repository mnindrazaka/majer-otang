import React from "react";
import { Box, Flex, Heading, VStack, Text, Button } from "@chakra-ui/react";
import { Billing } from "../../utils/fetcher";
import { FormMode, Event } from "../../machines/billings/billingMachine";

type Props = {
  billings: Billing[];
  send: (event: Event) => void;
};

const BillingList = ({ billings, send }: Props) => {
  const handleCreateForm = () => {
    send({
      type: "ACTIVATE_BILLING_FORM",
      formMode: FormMode.Create,
      billingId: null,
    });
  };

  const handleEditForm = (billingId: string) => {
    send({
      type: "ACTIVATE_BILLING_FORM",
      formMode: FormMode.Edit,
      billingId,
    });
  };

  return (
    <Box color="gray.200" mb="36">
      <Box
        width="full"
        bg="white"
        h="20"
        position="fixed"
        zIndex="10"
        left="0"
        right="0"
      >
        <Heading as="h3" textAlign="center" my="6" color="gray.700">
          Billings
        </Heading>
      </Box>
      <VStack spacing="4" pt="24">
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
              <Text
                fontSize="lg"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflowX="hidden"
                maxW={[220, 300]}
                fontWeight="semibold"
              >
                {billing.title}
              </Text>
              <Text>{`Rp ${billing.amount}`}</Text>
            </Box>
            <Button
              colorScheme="telegram"
              onClick={() => handleEditForm(billing.id)}
            >
              Edit
            </Button>
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
