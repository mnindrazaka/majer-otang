import React from "react";
import Layout from "../../components/Layout";
import BillingList from "./BillingList";
import BillingForm from "./BillingForm";
import GeneralError from "./GeneralError";
import { GeneralLoading } from "./GeneralLoading";
import { Box } from "@chakra-ui/react";
import BottomMenu from "../../components/BottomMenu";
import { useMachine } from "@xstate/react";
import {
  billingMachine,
  FormMode,
  MachineState,
} from "../../machines/billings/billingMachine";
import { match } from "ts-pattern";

const BillingsPage = () => {
  const [state, send, service] = useMachine(billingMachine);
  const { billings, members, billingError } = state.context;

  // Debugguing Purposes
  React.useEffect(() => {
    const subscription = service.subscribe((state) => {
      console.log(state);
    });

    return subscription.unsubscribe;
  }, [service]);

  return (
    <Layout>
      <Box width="full">
        {match<MachineState>(state as MachineState)
          .with({ value: "idle" }, () => <GeneralLoading />)
          .with({ value: "loadingBillings" }, () => <GeneralLoading />)
          .with({ value: "getBillingsOK" }, () => (
            <BillingList send={send} billings={billings} />
          ))
          .with({ value: "getBillingsError" }, () => (
            <GeneralError
              errorMessage={billingError}
              onRefetch={() => send({ type: "REFETCH_BILLINGS" })}
            />
          ))
          .with({ value: { billingFormIdle: "loadingMembers" } }, () => (
            <GeneralLoading />
          ))
          .with(
            { value: { billingFormIdle: "getBillingDetailCondition" } },
            () => <GeneralLoading />
          )
          .with({ value: { billingFormReady: "firstStep" } }, () => (
            <BillingForm members={members} send={send} />
          ))
          .with({ value: "billingFormIdle" }, () => null)
          .with({ value: "billingFormReady" }, () => null)
          .with({ value: "submitBilling" }, () => null)
          .with({ value: "submitBillingError" }, () => null)
          .with({ value: "submitBillingOK" }, () => null)
          .with(
            { value: { billingFormIdle: "getBillingDetailData" } },
            () => null
          )
          .with(
            { value: { billingFormIdle: "getBillingDetailDataError" } },
            () => null
          )
          .with({ value: { billingFormIdle: "getMembersError" } }, () => null)
          .with({ value: { billingFormReady: "secondStep" } }, () => null)
          .exhaustive()}
        <BottomMenu activeMenu="billings" />
      </Box>
    </Layout>
  );
};

export default BillingsPage;
