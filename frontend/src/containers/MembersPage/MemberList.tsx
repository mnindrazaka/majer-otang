import { Box, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useQuery } from "react-query";
import { match } from "ts-pattern";

import { membersApi } from "../../utils/fetcher";

const MemberList = () => {
  const query = useQuery("Members", () => membersApi.getMemberList());

  return (
    <Box mt="24" color="gray.200" mb="36">
      <VStack spacing="4">
        {match(query)
          .with({ status: "success" }, (query) =>
            query.data.data.map((member) => {
              return (
                <Box
                  key={member.id}
                  border="1px"
                  borderRadius="16px"
                  p="6"
                  w="full"
                  backgroundColor="gray.700"
                  cursor="pointer"
                >
                  <Link href={`/payments/${member.id}`}>
                    <Text fontSize="2xl" fontWeight="semibold">
                      {member.name}
                    </Text>
                  </Link>
                </Box>
              );
            })
          )
          .with({ status: "loading" }, () => (
            <Spinner color="blue.500" size="xl" thickness="4px" />
          ))
          .with({ status: "error" }, () => (
            <Heading size="lg" color="blackAlpha.700">
              Something went wrong
            </Heading>
          ))
          .with({ status: "idle" }, () => (
            <Spinner color="blue.500" size="xl" thickness="4px" />
          ))
          .exhaustive()}
      </VStack>
    </Box>
  );
};

export default MemberList;
