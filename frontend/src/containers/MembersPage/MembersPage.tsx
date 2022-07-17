import { Box, Heading } from "@chakra-ui/react";
import MemberList from "./MemberList";
import BottomMenu from "../../components/BottomMenu";

const MembersPage = () => {
  return (
    <Box width={"full"}>
      <Heading as={"h3"} textAlign={"center"} my={"6"}>
        Members
      </Heading>
      <MemberList />
      <BottomMenu activeMenu="members" />
    </Box>
  );
};

export default MembersPage;
