import { Box, Flex, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

export const GeneralLoading = () => {
  return (
    <Box justifyContent="center" mt="12">
      <Flex>
        <SkeletonCircle size="10" mr="4" />
        <SkeletonCircle size="10" mr="4" />
      </Flex>
      <SkeletonText mt="4" noOfLines={4} spacing="4" />
    </Box>
  );
};
