import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import ButtomMenu from "../../components/BottomMenu";
import Layout from "../../components/Layout";
import PaymentList from "./PaymentList";

const PaymentsPage = () => {
  return (
    <Layout>
      <Box width={"full"}>
        <Heading as={"h3"} textAlign={"center"} my={"6"}>
          Payments
        </Heading>
        <PaymentList />
        <ButtomMenu activeMenu="members" />
      </Box>
    </Layout>
  );
};

export default PaymentsPage;
