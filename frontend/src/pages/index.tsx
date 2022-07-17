import type { NextPage } from "next";
import Layout from "../components/Layout";
import MembersPage from "../containers/MembersPage";

const Home: NextPage = () => {
  return (
    <Layout>
      <MembersPage />
    </Layout>
  );
};

export default Home;
