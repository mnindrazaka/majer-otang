import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { Member, Payment } from "../../utils/fetcher";

interface PaymentListProps {
  payments: Payment[];
  member: Member;
  onItemClick: (payment: Payment) => void;
}

const PaymentList = (props: PaymentListProps) => {
  return (
    <Box m={"4"} color={"gray.200"} mb={"36"}>
      <Heading as="h5" color="gray.700" fontSize="xl" my="4">
        {`${props.member.name}'s payment`}
      </Heading>
      <VStack spacing={"4"}>
        {props.payments.map((payment) => (
          <Box
            key={payment.member_id}
            border={"1px"}
            borderRadius={"16px"}
            p={"6"}
            w={"full"}
            backgroundColor={"gray.700"}
            cursor={"pointer"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            onClick={() => props.onItemClick(payment)}
          >
            <Text fontSize={"2xl"} fontWeight={"semibold"}>
              {payment.name}
            </Text>
            <Text>Rp. {payment.amount}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default PaymentList;
