import { createMachine, assign } from "xstate";
import { match } from "ts-pattern";
import {
  Member,
  Billing,
  BillingDetail,
  BillingMember,
} from "../../utils/fetcher";
import { queryClient } from "../../pages/_app";
import { getBillings, getMembers } from "./mockFetcher";

type BillingForm = {
  title: string;
  total: number;
  chargedMember: string;
  isBillEqual: boolean;
  members: BillingMember[];
};

export enum FormMode {
  Create = "CREATE",
  Edit = "EDIT",
}

interface Context {
  billings: Billing[];
  billingError: string | null;
  formMode: FormMode;
  members: Member[];
  membersError: string | null;
  billingDetail?: BillingDetail;
  billingDetailError: string | null;
  billingForm?: BillingForm;
  submitBillingError: string | null;
}

export type MachineState =
  | {
      value: "idle";
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: undefined;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingError: null;
      };
    }
  | {
      value: "loadingBillings";
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: undefined;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingError: null;
      };
    }
  | {
      value: "getBillingsOK";
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: undefined;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingError: null;
      };
    }
  | {
      value: "getBillingsError";
      context: Context & {
        billingError: string;
        membersError: null;
        billingDetail: undefined;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingError: null;
      };
    }
  | {
      value: "billingFormIdle";
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: undefined;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingError: null;
      };
    }
  | {
      value: { billingFormIdle: "loadingMembers" };
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: undefined;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingError: null;
      };
    }
  | {
      value: { billingFormIdle: "getMembersError" };
      context: Context & {
        billingError: null;
        membersError: string;
        billingDetail: undefined;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingError: null;
      };
    }
  | {
      value: { billingFormIdle: "getBillingDetailCondition" };
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: undefined;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingError: null;
      };
    }
  | {
      value: { billingFormIdle: "getBillingDetailData" };
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: undefined;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingError: null;
      };
    }
  | {
      value: { billingFormIdle: "getBillingDetailDataError" };
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: undefined;
        billingDetailError: string;
        billingForm: undefined;
        submitBillingError: null;
      };
    }
  | {
      value: "billingFormReady";
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: BillingDetail;
        billingDetailError: null;
        billingForm: BillingForm;
        submitBillingError: null;
      };
    }
  | {
      value: { billingFormReady: "firstStep" };
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: BillingDetail;
        billingDetailError: null;
        billingForm: BillingForm;
        submitBillingError: null;
      };
    }
  | {
      value: { billingFormReady: "secondStep" };
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: BillingDetail;
        billingDetailError: null;
        billingForm: BillingForm;
        submitBillingError: null;
      };
    }
  | {
      value: "submitBilling";
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: BillingDetail;
        billingDetailError: null;
        billingForm: BillingForm;
        submitBillingError: null;
      };
    }
  | {
      value: "submitBillingOK";
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: BillingDetail;
        billingDetailError: null;
        billingForm: BillingForm;
        submitBillingError: null;
      };
    }
  | {
      value: "submitBillingError";
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: BillingDetail;
        billingDetailError: null;
        billingForm: BillingForm;
        submitBillingError: string;
      };
    };

export type MachineEvents =
  | { type: "FETCH_BILLINGS" }
  | { type: "FETCH_BILLINGS_SUCCES"; billingsData: Billing[] }
  | { type: "FETCH_BILLINGS_ERROR"; billingsErrorMessage: string }
  | { type: "ACTIVATE_BILLING_FORM"; formMode: FormMode }
  | { type: "REFETCH_BILLING" }
  | { type: "FETCH_MEMBERS_SUCCESS"; membersData: Member[] }
  | { type: "FETCH_MEMBERS_ERROR"; membersErrorMessage: string }
  | { type: "REFETCH_MEMBERS" }
  | { type: "FETCH_BILLING_DETAIL_SUCCES"; billingDetailData: BillingDetail }
  | { type: "FETCH_BILLING_DETAIL_ERROR"; billingDetailErrorMessage: string }
  | { type: "REFETCH_BILLING_DETAIL" }
  | { type: "UPDATE_FORM"; billingForm: BillingForm }
  | {
      type: "CANCEL_FILL_FORM";
    }
  | {
      type: "NEXT_STEP";
    }
  | { type: "PREV_STEP" }
  | {
      type: "SUBMIT_BILLING";
    }
  | { type: "SUBMIT_BILLING_SUCCES" }
  | { type: "SUBMIT_BILLING_ERROR"; submitBillingErrorMessage: string }
  | { type: "BACK_TO_BILLING_SCREEN" }
  | { type: "BACK_TO_SECOND_STEP_FORM" }
  | { type: "REFETCH_SUBMIT_BILLING" };

type MachineService = {
  getBillingsData: {
    data: Billing[];
  };
  getMembersData: {
    data: Member[];
  };
};

export const billingMachine = createMachine<
  Context,
  MachineEvents,
  MachineState
>({
  schema: {
    context: {} as Context,
    events: {} as MachineEvents,
    services: {} as MachineService,
  },
  id: "billing",
  initial: "idle",
  context: {
    billings: [],
    billingError: null,
    formMode: FormMode.Create,
    members: [],
    membersError: null,
    billingDetail: undefined,
    billingDetailError: null,
    billingForm: undefined,
    submitBillingError: null,
  },
  states: {
    idle: {
      invoke: {
        src: "initMachineTransitition",
      },
      on: {
        FETCH_BILLINGS: "loadingBillings",
      },
    },
    loadingBillings: {
      invoke: {
        src: "getBillingsData",
      },
      on: {
        FETCH_BILLINGS_SUCCES: {
          target: "getBillingsOK",
          actions: "updateContext",
        },
        FETCH_BILLINGS_ERROR: {
          target: "getBillingsError",
          actions: "updateContext",
        },
      },
    },
    getBillingsOK: {
      on: {
        ACTIVATE_BILLING_FORM: {
          actions: "updateContext",
          target: "billingFormIdle",
        },
      },
    },
    getBillingsError: {
      on: {
        REFETCH_BILLING: "loadingBillings",
      },
    },
    billingFormIdle: {
      initial: "loadingMembers",
      states: {
        loadingMembers: {
          invoke: {
            src: "getMembersData",
          },
          on: {
            FETCH_MEMBERS_SUCCESS: {
              target: "getBillingDetailCondition",
              actions: "updateContext",
            },
            FETCH_MEMBERS_ERROR: {
              target: "getMembersError",
              actions: "updateContext",
            },
          },
        },
        getMembersError: {
          on: {
            REFETCH_MEMBERS: "loadingMembers",
          },
        },
        getBillingDetailCondition: {
          always: [
            {
              cond: "isCreatingForm",
              target: "#billing.billingFormReady",
            },
            {
              target: "getBillingDetailData",
            },
          ],
        },
        getBillingDetailData: {
          on: {
            FETCH_BILLING_DETAIL_SUCCES: {
              target: "#billing.billingFormReady",
              actions: "updateContext",
            },
            FETCH_BILLING_DETAIL_ERROR: {
              target: "getBillingDetailDataError",
              actions: "updateContext",
            },
          },
        },
        getBillingDetailDataError: {
          on: {
            REFETCH_BILLING_DETAIL: "getBillingDetailData",
          },
        },
      },
    },
    billingFormReady: {
      initial: "firstStep",
      states: {
        firstStep: {
          on: {
            NEXT_STEP: {
              target: "secondStep",
            },
            UPDATE_FORM: {
              actions: "updateContext",
            },
          },
        },
        secondStep: {
          on: {
            PREV_STEP: "firstStep",
            UPDATE_FORM: {
              actions: "updateContext",
            },
            SUBMIT_BILLING: "#billing.submitBilling",
          },
        },
      },
      on: {
        CANCEL_FILL_FORM: "getBillingsOK",
      },
    },
    submitBilling: {
      on: {
        SUBMIT_BILLING_SUCCES: {
          target: "submitBillingOK",
        },
        SUBMIT_BILLING_ERROR: {
          target: "submitBillingError",
          actions: "updateContext",
        },
      },
    },
    submitBillingOK: {
      on: {
        BACK_TO_BILLING_SCREEN: {
          target: "loadingBillings",
        },
      },
    },
    submitBillingError: {
      on: {
        BACK_TO_SECOND_STEP_FORM: "billingFormReady.secondStep",
        REFETCH_SUBMIT_BILLING: "submitBilling",
      },
    },
  },
}).withConfig({
  services: {
    initMachineTransitition: () => (send) => {
      send({ type: "FETCH_BILLINGS" });
    },
    getBillingsData: () => (send) => {
      queryClient
        .fetchQuery("billings", getBillings)
        .then((response) =>
          send({ type: "FETCH_BILLINGS_SUCCES", billingsData: response.data })
        )
        .catch((error) =>
          send({ type: "FETCH_BILLINGS_ERROR", billingsErrorMessage: error })
        );
    },
    getMembersData: () => (send) => {
      queryClient
        .fetchQuery("members", getMembers)
        .then((response) =>
          send({ type: "FETCH_MEMBERS_SUCCESS", membersData: response.data })
        )
        .catch((error) =>
          send({ type: "FETCH_MEMBERS_ERROR", membersErrorMessage: error })
        );
    },
  },
  actions: {
    updateContext: assign((ctx, event) =>
      match(event)
        .with({ type: "FETCH_BILLINGS" }, () => ctx)
        .with({ type: "REFETCH_BILLING" }, () => ({
          ...ctx,
          billingError: null,
          billings: [],
        }))
        .with({ type: "REFETCH_MEMBERS" }, () => ({
          ...ctx,
          membersError: null,
          members: [],
        }))
        .with({ type: "REFETCH_BILLING_DETAIL" }, () => ({
          ...ctx,
          billingDetailError: null,
          billingDetail: undefined,
        }))
        .with({ type: "REFETCH_SUBMIT_BILLING" }, () => ({
          ...ctx,
          submitBillingError: null,
        }))
        .with({ type: "NEXT_STEP" }, () => ctx)
        .with({ type: "PREV_STEP" }, () => ctx)
        .with({ type: "SUBMIT_BILLING" }, () => ctx)
        .with({ type: "SUBMIT_BILLING_SUCCES" }, () => ctx)
        .with({ type: "BACK_TO_SECOND_STEP_FORM" }, () => ctx)
        .with({ type: "CANCEL_FILL_FORM" }, () => ctx)
        .with({ type: "BACK_TO_BILLING_SCREEN" }, () => ({
          ...ctx,
          billings: [],
          billingError: null,
          formMode: FormMode.Create,
          members: [],
          membersError: null,
          billingDetail: undefined,
          billingDetailError: null,
          billingForm: undefined,
          submitBillingError: null,
        }))
        .with({ type: "ACTIVATE_BILLING_FORM" }, (event) => ({
          ...ctx,
          formMode: event.formMode,
          billingForm: {
            title: "",
            total: 0,
            chargedMember: "",
            isBillEqual: true,
            members: [],
          },
        }))
        .with({ type: "FETCH_BILLINGS_SUCCES" }, (event) => ({
          ...ctx,
          billings: event.billingsData,
        }))
        .with({ type: "FETCH_BILLINGS_ERROR" }, (event) => ({
          ...ctx,
          billingError: event.billingsErrorMessage,
        }))
        .with({ type: "FETCH_BILLING_DETAIL_SUCCES" }, (event) => ({
          ...ctx,
          billingDetail: event.billingDetailData,
          billingForm: {
            title: event.billingDetailData.title,
            total: event.billingDetailData.bill_amount,
            chargedMember: event.billingDetailData.charged_member_id,
            isBillEqual: event.billingDetailData.is_bill_equally,
            members: event.billingDetailData.members,
          },
        }))
        .with({ type: "FETCH_BILLING_DETAIL_ERROR" }, (event) => ({
          ...ctx,
          billingDetailError: event.billingDetailErrorMessage,
        }))
        .with({ type: "FETCH_MEMBERS_SUCCESS" }, (event) => ({
          ...ctx,
          members: event.membersData,
        }))
        .with({ type: "FETCH_MEMBERS_ERROR" }, (event) => ({
          ...ctx,
          membersError: event.membersErrorMessage,
        }))
        .with({ type: "UPDATE_FORM" }, (event) => ({
          ...ctx,
          billingForm: event.billingForm,
        }))
        .with({ type: "SUBMIT_BILLING_ERROR" }, (event) => ({
          ...ctx,
          submitBillingError: event.submitBillingErrorMessage,
        }))
        .exhaustive()
    ),
  },
  guards: {
    isCreatingForm: (ctx) => ctx.formMode === "CREATE",
  },
});
