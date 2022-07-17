import { Box } from "@chakra-ui/react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  return (
    <Box backgroundColor={"gray.200"}>
      <Box
        minH={"100vh"}
        maxW={"480"}
        display={"flex"}
        justifyContent={"center"}
        marginX={"auto"}
        borderColor={"gray.700"}
      >
        {props.children}
      </Box>
    </Box>
  );
};

export default Layout;
