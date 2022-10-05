import { Box, Heading } from "@chakra-ui/react";
import MemberList from "./MemberList";
import BottomMenu from "../../components/BottomMenu";
import Layout from "../../components/Layout";

const MembersPage = () => {
  return (
    <Layout>
      <Box width="full">
        <Box width="full" bg="white" h="20" position="fixed" left="0" right="0">
          <Heading color="gray.700" as="h3" my="6" textAlign="center">
            Members
          </Heading>
        </Box>
        <MemberList />
        <BottomMenu activeMenu="members" />
      </Box>
    </Layout>
  );
};

export default MembersPage;
