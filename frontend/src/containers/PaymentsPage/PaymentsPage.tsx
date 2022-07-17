import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import ButtonMenu from "../../components/ButtonMenu";
import CardPayment from "./CardPayment";

const PaymentsPage = () => {
  return (
    <Box width={"full"}>
      <Heading as={"h3"} textAlign={"center"} my={"6"}>
        Payments
      </Heading>
      <CardPayment />
      <ButtonMenu activeMenu="members" />
    </Box>
  );
};

export default PaymentsPage;
