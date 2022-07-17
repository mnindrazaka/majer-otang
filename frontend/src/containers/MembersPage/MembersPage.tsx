import { Box, Heading } from "@chakra-ui/react";
import CardMember from "./CardMember";
import MenuMember from "./MenuMember";

const MembersPage = () => {
  return (
    <Box width={"full"}>
      <Heading as={"h3"} textAlign={"center"} my={"6"}>
        Members
      </Heading>
      <CardMember />
      <MenuMember />
    </Box>
  );
};

export default MembersPage;
