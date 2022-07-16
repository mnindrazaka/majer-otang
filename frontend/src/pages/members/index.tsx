import { Box, Heading, Text } from "@chakra-ui/react";
import CardMember from "../../containers/members/CardMember";
import MenuMember from "../../containers/members/MenuMember";

const Members = () => {
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

export default Members;
