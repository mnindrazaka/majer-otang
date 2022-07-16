import { Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Members from "./members";

const Home: NextPage = () => {
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
        <Members />
      </Box>
    </Box>
  );
};

export default Home;
