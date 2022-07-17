import { Box, Heading } from "@chakra-ui/react";
import CardMember from "./CardMember";
import MenuButton from "./MenuButton";

const MembersPage = () => {
  return (
    <Box width={"full"}>
      <Heading as={"h3"} textAlign={"center"} my={"6"}>
        Members
      </Heading>
      <CardMember />
      <MenuButton activeMenu="members" />
    </Box>
  );
};

export default MembersPage;
