import { Box, HStack } from "@chakra-ui/react";
import Link from "next/link";

const menus = {
  members: "members",
  billings: "billings"
};

interface MenuItemProps {
  title: string;
  isActive: boolean;
}

const MenuItem = (props: MenuItemProps) => {
  return (
    <Link href={props.title === Object.keys(menus)[0] ? "/" : props.title}>
      <Box
        w={"50%"}
        textAlign={"center"}
        borderRadius={"12px"}
        py={"4"}
        cursor={"pointer"}
        backgroundColor={props.isActive ? "gray.100" : "gray.700"}
        color={props.isActive ? "gray.700" : "gray.100"}
        textTransform={"capitalize"}
      >
        {props.title}
      </Box>
    </Link>
  );
};

type BottomMenuProps = {
  activeMenu: keyof typeof menus;
};

const BottomMenu = (props: BottomMenuProps) => {
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
        {Object.entries(menus).map(([id, title]) => (
          <MenuItem key={id} title={title} isActive={props.activeMenu === id} />
        ))}
      </HStack>
    </Box>
  );
};

export default BottomMenu;
