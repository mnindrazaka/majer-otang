import React from "react";
import Layout from "../../components/Layout";
import { Box, Heading, VStack, Text, Button } from "@chakra-ui/react";
import BottomMenu from "../../components/BottomMenu";

const BillingsPage = () => {
  return (
    <Layout>
      <Box width="full">
        <Heading as="h3" textAlign="center" my="6" color="gray.700">
          Billings
        </Heading>
        <Box m="4" color="gray.200" mb="36">
          <VStack spacing="4">
            <Box
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
                  John Doe
                </Text>
                <Text>Rp. 10000</Text>
              </Box>
              <Button colorScheme="telegram">Edit</Button>
            </Box>
          </VStack>
        </Box>

        <BottomMenu activeMenu="billings" />
      </Box>
    </Layout>
  );
};

export default BillingsPage;
