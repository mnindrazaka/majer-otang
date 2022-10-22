import { Box } from "@chakra-ui/react";
import { useMachine } from "@xstate/react";
import React from "react";
import { match } from "ts-pattern";

import BottomMenu from "../../components/BottomMenu";
import Layout from "../../components/Layout";
import { billingMachine, State } from "../../machines/billings/billingMachine";
import BillingFormFirstStep from "./BillingForm__FirstStep";
import BillingFormSecondStep from "./BillingForm__SecondStep";
import BillingList from "./BillingList";
import GeneralError from "./GeneralError";
import { GeneralLoading } from "./GeneralLoading";
import GeneralSuccess from "./GeneralSuccess";

const BillingsPage = () => {
  const [state, send, service] = useMachine(billingMachine);

  // Debugging Purposes
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const subscription = service.subscribe((state) => {
        console.log(state);
      });
      return subscription.unsubscribe;
    }
  }, [service]);

  return (
    <Layout>
      <Box width="full">
        {match<State.t>(state as State.t)
          .with({ value: "idle" }, () => <GeneralLoading />)
          .with({ value: "loadingBillings" }, () => <GeneralLoading />)
          .with({ value: "getBillingsOK" }, ({ context: { billings } }) => {
            return <BillingList send={send} billings={billings} />;
          })
          .with(
            { value: "getBillingsError" },
            ({ context: { billingError } }) => (
              <GeneralError
                errorMessage={billingError}
                onRefetch={() => send({ type: "REFETCH_BILLINGS" })}
              />
            )
          )
          .with({ value: "billingFormIdle" }, () => <GeneralLoading />)
          .with({ value: { billingFormIdle: "loadingMembers" } }, () => (
            <GeneralLoading />
          ))
          .with(
            { value: { billingFormIdle: "getMembersError" } },
            ({ context: { membersError } }) => (
              <GeneralError
                errorMessage={membersError}
                onRefetch={() => send({ type: "REFETCH_MEMBERS" })}
              />
            )
          )
          .with(
            { value: { billingFormIdle: "getBillingDetailCondition" } },
            () => <GeneralLoading />
          )
          .with(
            { value: { billingFormIdle: "loadingBillingDetailData" } },
            () => <GeneralLoading />
          )
          .with(
            { value: { billingFormIdle: "getBillingDetailDataError" } },
            ({ context: { billingDetailError } }) => (
              <GeneralError
                errorMessage={billingDetailError}
                onRefetch={() => send({ type: "REFETCH_BILLING_DETAIL" })}
              />
            )
          )
          .with({ value: "billingFormReady" }, () => <GeneralLoading />)
          .with(
            { value: { billingFormReady: "firstStep" } },
            ({ context: { members, billingForm } }) => (
              <BillingFormFirstStep
                billingForm={billingForm}
                members={members}
                send={send}
              />
            )
          )
          .with(
            { value: { billingFormReady: "secondStep" } },
            ({ context: { members, billingForm } }) => (
              <BillingFormSecondStep
                billingForm={billingForm}
                members={members}
                send={send}
              />
            )
          )
          .with({ value: "submitBilling" }, () => <GeneralLoading />)
          .with(
            { value: "submitBillingError" },
            ({ context: { submitBillingDetailError } }) => (
              <GeneralError
                errorMessage={submitBillingDetailError}
                onRefetch={() => send({ type: "REFETCH_SUBMIT_BILLING" })}
              />
            )
          )
          .with({ value: "submitBillingOK" }, () => (
            <GeneralSuccess
              content="Congrats! Success To Submit Billing"
              onOk={() => send({ type: "BACK_TO_BILLING_SCREEN" })}
            />
          ))
          .exhaustive()}
        <BottomMenu activeMenu="billings" />
      </Box>
    </Layout>
  );
};

export default BillingsPage;
