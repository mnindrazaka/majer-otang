import { Box, Heading } from "@chakra-ui/react";
import MemberList from "./MemberList";
import BottomMenu from "../../components/BottomMenu";
import Layout from "../../components/Layout";

const MembersPage = () => {
  return (
    <Layout>
      <Box width={"full"}>
        <Heading as={"h3"} textAlign={"center"} my={"6"}>
          Members
        </Heading>
        <MemberList />
        <BottomMenu activeMenu="members" />
      </Box>
    </Layout>
  );
};

export default MembersPage;
