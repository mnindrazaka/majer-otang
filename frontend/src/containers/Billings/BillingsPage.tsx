import React from "react";
import Layout from "../../components/Layout";
import BillingForm from "./BillingForm";
import {
  Box,
  Flex,
  Heading,
  VStack,
  Text,
  Button,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import BottomMenu from "../../components/BottomMenu";
import { useMachine } from "@xstate/react";
import {
  billingMachine,
  FormMode,
} from "../../machines/billings/billingMachine";

const BillingsPage = () => {
  const [state, send, service] = useMachine(billingMachine);
  const { billings, members } = state.context;

  // Debugguing Purposes
  React.useEffect(() => {
    const subscription = service.subscribe((state) => {
      console.log(state);
    });

    return subscription.unsubscribe;
  }, [service]);

  const handleCreateForm = () => {
    send({ type: "ACTIVATE_BILLING_FORM", formMode: FormMode.Create });
  };

  return (
    <Layout>
      <Box width="full">
        <Box m="4" color="gray.200" mb="36">
          {state.matches("loadingBillings") && (
            <>
              <SkeletonCircle size="10" />
              <SkeletonText mt="4" noOfLines={4} spacing="4" />
            </>
          )}
          {state.matches("getBillingsOK") && (
            <>
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
              <Flex
                minWidth="max-content"
                alignItems="center"
                justify="end"
                py="4"
              >
                <Button
                  colorScheme="blue"
                  justifySelf="end"
                  onClick={handleCreateForm}
                >
                  Create
                </Button>
              </Flex>
            </>
          )}
        </Box>
        {state.matches({ billingFormReady: "firstStep" }) && (
          <BillingForm members={members} send={send} />
        )}
        <BottomMenu activeMenu="billings" />
      </Box>
    </Layout>
  );
};

export default BillingsPage;
