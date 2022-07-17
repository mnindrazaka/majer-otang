import { Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import Layout from "../components/Layout";
import Members from "./members";

const Home: NextPage = () => {
  return (
    <Layout>
      <Members />
    </Layout>
  );
};

export default Home;
