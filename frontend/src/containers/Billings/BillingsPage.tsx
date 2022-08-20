import React from "react";
import Layout from "../../components/Layout";
import BillingList from "./BillingList";
import BillingFormFirstStep from "./BillingForm__FirstStep";
import BillingFormSecondStep from "./BillingForm__SecondStep";
import GeneralError from "./GeneralError";
import { GeneralLoading } from "./GeneralLoading";
import { Box } from "@chakra-ui/react";
import BottomMenu from "../../components/BottomMenu";
import { useMachine } from "@xstate/react";
import { billingMachine, State } from "../../machines/billings/billingMachine";
import { match } from "ts-pattern";

const BillingsPage = () => {
  const [state, send, service] = useMachine(billingMachine);

  const historyEvent = state.history?.event;

  // Debugging Purposes
  React.useEffect(() => {
    const subscription = service.subscribe((state) => {
      console.log(state);
    });

    return subscription.unsubscribe;
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
          .with({ value: { billingFormIdle: "loadingMembers" } }, () => (
            <GeneralLoading />
          ))
          .with(
            { value: { billingFormIdle: "getBillingDetailCondition" } },
            () => <GeneralLoading />
          )
          .with(
            { value: { billingFormReady: "firstStep" } },
            ({
              context: { members, billingDetail, formMode, billingForm },
            }) => (
              <BillingFormFirstStep
                historyEvent={historyEvent}
                billingForm={billingForm}
                formMode={formMode}
                billingDetail={billingDetail}
                members={members}
                send={send}
              />
            )
          )
          .with(
            { value: { billingFormReady: "secondStep" } },
            ({
              context: { members, billingDetail, billingForm, formMode },
            }) => (
              <BillingFormSecondStep
                formMode={formMode}
                billingForm={billingForm}
                billingDetail={billingDetail}
                members={members}
                send={send}
              />
            )
          )
          .with({ value: "billingFormIdle" }, () => null)
          .with({ value: "billingFormReady" }, () => null)
          .with({ value: "submitBilling" }, () => null)
          .with({ value: "submitBillingError" }, () => null)
          .with({ value: "submitBillingOK" }, () => null)
          .with(
            { value: { billingFormIdle: "loadingBillingDetailData" } },
            () => null
          )
          .with(
            { value: { billingFormIdle: "getBillingDetailDataError" } },
            () => null
          )
          .with({ value: { billingFormIdle: "getMembersError" } }, () => null)
          .exhaustive()}
        <BottomMenu activeMenu="billings" />
      </Box>
    </Layout>
  );
};

export default BillingsPage;
