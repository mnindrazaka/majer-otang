import { createMachine, assign } from "xstate";
import { match } from "ts-pattern";
import {
  Member,
  Billing,
  BillingDetail,
  BillingMember,
} from "../../utils/fetcher";

type BillingForm = {
  title?: string;
  total?: number;
  chargedMember?: string;
  isBillEqual: boolean;
  members?: BillingMember[];
};

type FormMode = "CREATE" | "EDIT";

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

type MachineState =
  | {
      value: "idle";
      context: Context & {
        billings: [];
        billingError: null;
        formMode: "CREATE";
        members: [];
        membersError: null;
        billingDetail: undefined;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingError: null;
      };
    }
  | {
      value: "loadingBilling";
      context: Context & {
        billings: [];
        billingError: null;
        formMode: "CREATE";
        members: [];
        membersError: null;
        billingDetail: undefined;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingError: null;
      };
    }
  | {
      value: "getBillingOK";
      context: Context & {
        billings: Billing[];
        billingError: null;
        formMode: "CREATE";
        members: [];
        membersError: null;
        billingDetail: undefined;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingError: null;
      };
    }
  | {
      value: "getBillingError";
      context: Context & {
        billings: Billing[];
        billingError: string;
        formMode: "CREATE";
        members: [];
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
        billings: Billing[];
        billingError: null;
        formMode: "CREATE";
        members: [];
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
        billings: Billing[];
        billingError: null;
        formMode: "CREATE";
        members: [];
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
        billings: Billing[];
        billingError: null;
        formMode: "CREATE";
        members: [];
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
        billings: Billing[];
        billingError: null;
        formMode: "CREATE";
        members: Member[];
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
        billings: Billing[];
        billingError: null;
        formMode: "EDIT";
        members: Member[];
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
        billings: Billing[];
        billingError: null;
        formMode: "EDIT";
        members: Member[];
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
        billings: Billing[];
        billingError: null;
        formMode: "CREATE" | "EDIT";
        members: Member[];
        membersError: null;
        billingDetail: BillingDetail;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingError: null;
      };
    }
  | {
      value: { billingFormReady: "firstStep" };
      context: Context & {
        billings: Billing[];
        billingError: null;
        formMode: "CREATE" | "EDIT";
        members: Member[];
        membersError: null;
        billingDetail: BillingDetail;
        billingDetailError: null;
        billingForm: BillingForm & {
          title: string;
          total: number;
          chargedMember: string;
          isBillEqual: boolean;
          members: [];
        };
        submitBillingError: null;
      };
    }
  | {
      value: { billingFormReady: "secondStep" };
      context: Context & {
        billings: Billing[];
        billingError: null;
        formMode: "CREATE" | "EDIT";
        members: Member[];
        membersError: null;
        billingDetail: BillingDetail;
        billingDetailError: null;
        billingForm: BillingForm & {
          title: string;
          total: number;
          chargedMember: string;
          isBillEqual: boolean;
          members: BillingMember[];
        };
        submitBillingError: null;
      };
    }
  | {
      value: "submitBilling";
      context: Context & {
        billings: Billing[];
        billingError: null;
        formMode: "CREATE" | "EDIT";
        members: Member[];
        membersError: null;
        billingDetail: BillingDetail;
        billingDetailError: null;
        billingForm: BillingForm & {
          title: string;
          total: number;
          chargedMember: string;
          isBillEqual: boolean;
          members: BillingMember[];
        };
        submitBillingError: null;
      };
    }
  | {
      value: "submitBillingOK";
      context: Context & {
        billings: Billing[];
        billingError: null;
        formMode: "CREATE" | "EDIT";
        members: Member[];
        membersError: null;
        billingDetail: BillingDetail;
        billingDetailError: null;
        billingForm: BillingForm & {
          title: string;
          total: number;
          chargedMember: string;
          isBillEqual: boolean;
          members: BillingMember[];
        };
        submitBillingError: null;
      };
    }
  | {
      value: "submitBillingError";
      context: Context & {
        billings: Billing[];
        billingError: null;
        formMode: "CREATE" | "EDIT";
        members: Member[];
        membersError: null;
        billingDetail: BillingDetail;
        billingDetailError: null;
        billingForm: BillingForm & {
          title: string;
          total: number;
          chargedMember: string;
          isBillEqual: boolean;
          members: BillingMember[];
        };
        submitBillingError: string;
      };
    };

type MachineEvents =
  | { type: "FETCH_BILLING" }
  | { type: "FETCH_BILLING_SUCCES"; billingsData: Billing[] }
  | { type: "FETCH_BILLING_ERROR"; billingsErrorMessage: string }
  | { type: "ACTIVATE_BILLING_FORM" }
  | { type: "REFETCH_BILLING" }
  | { type: "FETCH_MEMBER_SUCCESS"; membersData: Member[] }
  | { type: "FETCH_MEMBER_ERROR"; membersErrorMessage: string }
  | { type: "REFTECH_MEMBERS" }
  | { type: "FETCH_BILLING_DETAIL_SUCCES"; billingDetailData: BillingDetail }
  | { type: "FETCH_BILLING_DETAIL_ERROR"; billingDetailErrorMessage: string }
  | { type: "REFTECH_BILLING_DETAIL" }
  | { type: "UPDATE_FORM"; billingDetail: BillingForm }
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

export const billingMachine = createMachine<
  Context,
  MachineEvents,
  MachineState
>({
  schema: {
    context: {} as Context,
    events: {} as MachineEvents,
  },
  id: "billing",
  initial: "idle",
  context: {
    billings: [],
    billingError: null,
    formMode: "CREATE",
    members: [],
    membersError: null,
    billingDetail: undefined,
    billingDetailError: null,
    billingForm: undefined,
    submitBillingError: null,
  },
  states: {
    idle: {
      on: {
        FETCH_BILLING: "loadingBilling",
      },
    },
    loadingBilling: {
      on: {
        FETCH_BILLING_SUCCES: {
          target: "getBillingOK",
          actions: "updateContext",
        },
        FETCH_BILLING_ERROR: {
          target: "getBillingError",
          actions: "updateContext",
        },
      },
    },
    getBillingOK: {
      entry: "assignBillingsData",
      on: {
        ACTIVATE_BILLING_FORM: "billingFormIdle",
      },
    },
    getBillingError: {
      on: {
        REFETCH_BILLING: "loadingBilling",
      },
    },
    billingFormIdle: {
      initial: "loadingMembers",
      states: {
        loadingMembers: {
          on: {
            FETCH_MEMBER_SUCCESS: {
              target: "getBillingDetailCondition",
              actions: "updateContext",
            },
            FETCH_MEMBER_ERROR: {
              target: "getMembersError",
              actions: "updateContext",
            },
          },
        },
        getMembersError: {
          on: {
            REFTECH_MEMBERS: "loadingMembers",
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
            REFTECH_BILLING_DETAIL: "getBillingDetailData",
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
        CANCEL_FILL_FORM: "getBillingOK",
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
          target: "loadingBilling",
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
  actions: {
    updateContext: assign((ctx, event) =>
      match(event)
        .with({ type: "FETCH_BILLING" }, () => ctx)
        .with({ type: "ACTIVATE_BILLING_FORM" }, () => ctx)
        .with({ type: "REFETCH_BILLING" }, () => ctx)
        .with({ type: "REFTECH_MEMBERS" }, () => ctx)
        .with({ type: "REFTECH_BILLING_DETAIL" }, () => ctx)
        .with({ type: "REFETCH_SUBMIT_BILLING" }, () => ctx)
        .with({ type: "NEXT_STEP" }, () => ctx)
        .with({ type: "PREV_STEP" }, () => ctx)
        .with({ type: "SUBMIT_BILLING" }, () => ctx)
        .with({ type: "SUBMIT_BILLING_SUCCES" }, () => ctx)
        .with({ type: "BACK_TO_BILLING_SCREEN" }, () => ctx)
        .with({ type: "BACK_TO_SECOND_STEP_FORM" }, () => ctx)
        .with({ type: "CANCEL_FILL_FORM" }, () => ctx)
        .with({ type: "FETCH_BILLING_SUCCES" }, (event) => ({
          billings: event.billingsData,
        }))
        .with({ type: "FETCH_BILLING_ERROR" }, (event) => ({
          billingError: event.billingsErrorMessage,
        }))
        .with({ type: "FETCH_BILLING_DETAIL_SUCCES" }, (event) => ({
          billingDetail: event.billingDetailData,
        }))
        .with({ type: "FETCH_BILLING_DETAIL_ERROR" }, (event) => ({
          billingDetailError: event.billingDetailErrorMessage,
        }))
        .with({ type: "FETCH_MEMBER_SUCCESS" }, (event) => ({
          members: event.membersData,
        }))
        .with({ type: "FETCH_MEMBER_ERROR" }, (event) => ({
          membersError: event.membersErrorMessage,
        }))
        .with({ type: "UPDATE_FORM" }, (event) => ({
          billingForm: event.billingDetail,
        }))
        .with({ type: "SUBMIT_BILLING_ERROR" }, (event) => ({
          submitBillingError: event.submitBillingErrorMessage,
        }))
        .exhaustive()
    ),
  },
  guards: {
    isCreatingForm: (ctx) => ctx.formMode === "CREATE",
  },
});
