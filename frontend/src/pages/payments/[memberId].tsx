import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import PaymentPage from "../../containers/PaymentsPage";
import { PaymentsPageProps } from "../../containers/PaymentsPage/PaymentsPage";

export default PaymentPage;

interface Query extends ParsedUrlQuery {
  memberId: string;
}

export const getServerSideProps: GetServerSideProps<
  PaymentsPageProps,
  Query
> = async ({ params }) => {
  return {
    props: {
      memberId: params?.memberId ?? ""
    }
  };
};
