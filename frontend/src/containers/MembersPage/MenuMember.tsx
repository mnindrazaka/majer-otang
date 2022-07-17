import { Box, HStack } from "@chakra-ui/react";

const MenuMember = () => {
  const billing = "billings";

  return (
    <Box
      position={"fixed"}
      right={"0"}
      left={"0"}
      bottom={"0"}
      backgroundColor={"white"}
      py={"4"}
      display={"flex"}
      justifyContent={"center"}
    >
      <HStack
        justifyContent={"space-between"}
        mx={"4"}
        border={"1px"}
        borderRadius={"16px"}
        padding={"1"}
        backgroundColor={"gray.700"}
        position={"relative"}
        maxW={"440px"}
        w={"full"}
        py={"1"}
      >
        <Box
          w={"50%"}
          textAlign={"center"}
          borderRadius={"12px"}
          py={"4"}
          backgroundColor={"gray.100"}
        >
          Members
        </Box>
        <Box
          w={"50%"}
          textAlign={"center"}
          borderRadius={"16px"}
          py={"4"}
          color={"white"}
        >
          Bills
        </Box>
      </HStack>
    </Box>
  );
};

export default MenuMember;
