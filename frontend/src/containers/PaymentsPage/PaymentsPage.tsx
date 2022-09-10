import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import ButtomMenu from "../../components/BottomMenu";
import Layout from "../../components/Layout";
import { useMachine } from "@xstate/react";
import { createPaymentMachine, State } from "../../machines/paymentMachine";
import { GeneralLoading } from "../Billings/GeneralLoading";
import { match } from "ts-pattern";
import PaymentList from "./PaymentList";
import ConfirmationModal from "./ConfirmationModal";

export interface PaymentsPageProps {
  memberId: string;
}

const PaymentsPage = (props: PaymentsPageProps) => {
  const [state, send] = useMachine(
    createPaymentMachine({ memberId: props.memberId })
  );

  return (
    <Layout>
      <Box width="full">
        <>
          <Heading as="h3" textAlign="center" my="6">
            Payments
          </Heading>
          {match<State.t>(state as State.t)
            .with({ value: "idle" }, () => <GeneralLoading />)
            .with({ value: "fetchingMember" }, () => <GeneralLoading />)
            .with({ value: "fetchingMemberSuccess" }, () => <GeneralLoading />)
            .with(
              { value: "fetchingMemberError" },
              ({ context: { memberError } }) => {
                return <Heading>{memberError}</Heading>;
              }
            )
            .with({ value: "fetchingPayments" }, () => <GeneralLoading />)
            .with(
              { value: "fetchingPaymentSuccess" },
              ({ context: { payments, member } }) => (
                <PaymentList
                  member={member}
                  payments={payments}
                  onItemClick={(payment) =>
                    send({
                      type: "SELECT_PAYMENT_TARGET",
                      targetMemberId: payment.member_id
                    })
                  }
                />
              )
            )
            .with(
              { value: "fetchingPaymentError" },
              ({ context: { paymentsError } }) => (
                <Heading>{paymentsError}</Heading>
              )
            )
            .with({ value: "confirmingPayment" }, () => (
              <ConfirmationModal send={send} state={state as State.t} /> // TODO: Fix typing
            ))
            .with({ value: "submittingPayment" }, () => (
              <ConfirmationModal send={send} state={state as State.t} /> // TODO: Fix typing
            ))
            .with({ value: "submittingPaymentError" }, () => (
              <ConfirmationModal send={send} state={state as State.t} /> // TODO: Fix typing
            ))
            .exhaustive()}
          <ButtomMenu activeMenu="members" />
        </>
      </Box>
    </Layout>
  );
};

export default PaymentsPage;
