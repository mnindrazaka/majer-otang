import { createMachine, assign } from "xstate";
import { GetMemberListResponse } from "../../utils/fetcher";

type Billing = {
  id: string;
  title: string;
  amount: number;
};

type BillingDetailMember = {
  id: string;
  name: string;
  amount: number;
};

type BillingDetail = {
  id: string;
  name: string;
  billAmount: number;
  chargedMemberId: string;
  isBillEqually: boolean;
  members: BillingDetailMember[];
};

type BillingForm = {
  title: string;
  total: number;
  chargedMember: string;
  isBillEqual: boolean;
  members: BillingDetailMember[];
};

type FORMMODE = "CREATE" | "EDIT";

interface Context {
  billings?: Billing[];
  billingError?: string;
  formMode?: FORMMODE;
  members?: GetMemberListResponse["data"];
  membersError?: string;
  billingDetail?: BillingDetail;
  billingDetailError?: string;
  billingForm?: BillingForm;
  submitBillingError?: string;
}

type MachineState =
  | {
      value: "idle";
      context: Context & {
        billings: undefined;
        billingError: undefined;
        formMode: undefined;
        members: undefined;
        membersError: undefined;
        billingDetail: undefined;
        billingDetailError: undefined;
        billingForm: undefined;
        submitBillingError: undefined;
      };
    }
  | {
      value: "loadingBilling";
      context: Context & {
        billings: undefined;
        billingError: undefined;
        formMode: undefined;
        members: undefined;
        membersError: undefined;
        billingDetail: undefined;
        billingDetailError: undefined;
        billingForm: undefined;
        submitBillingError: undefined;
      };
    }
  | {
      value: "getBillingOK";
      context: Context & {
        billings: Billing[];
        billingError: undefined;
        formMode: undefined;
        members: undefined;
        membersError: undefined;
        billingDetail: undefined;
        billingDetailError: undefined;
        billingForm: undefined;
        submitBillingError: undefined;
      };
    }
  | {
      value: "getBillingError";
      context: Context & {
        billings: Billing[];
        billingError: string;
        formMode: undefined;
        members: undefined;
        membersError: undefined;
        billingDetail: undefined;
        billingDetailError: undefined;
        billingForm: undefined;
        submitBillingError: undefined;
      };
    }
  | {
      value: "billingFormIdle";
      context: Context & {
        billings: Billing[];
        billingError: undefined;
        formMode: undefined;
        members: undefined;
        membersError: undefined;
        billingDetail: undefined;
        billingDetailError: undefined;
        billingForm: undefined;
        submitBillingError: undefined;
      };
    }
  | {
      value: { billingFormIdle: "loadingMembers" };
      context: Context & {
        billings: Billing[];
        billingError: undefined;
        formMode: undefined;
        members: undefined;
        membersError: undefined;
        billingDetail: undefined;
        billingDetailError: undefined;
        billingForm: undefined;
        submitBillingError: undefined;
      };
    }
  | {
      value: { billingFormIdle: "getMembersError" };
      context: Context & {
        billings: Billing[];
        billingError: undefined;
        formMode: undefined;
        members: undefined;
        membersError: string;
        billingDetail: undefined;
        billingDetailError: undefined;
        billingForm: undefined;
        submitBillingError: undefined;
      };
    }
  | {
      value: { billingFormIdle: "getBillingDetailCondition" };
      context: Context & {
        billings: Billing[];
        billingError: undefined;
        formMode: undefined;
        members: GetMemberListResponse["data"];
        membersError: undefined;
        billingDetail: undefined;
        billingDetailError: undefined;
        billingForm: undefined;
        submitBillingError: undefined;
      };
    }
  | {
      value: { billingFormIdle: "getBillingDetailData" };
      context: Context & {
        billings: Billing[];
        billingError: undefined;
        formMode: undefined;
        members: GetMemberListResponse["data"];
        membersError: undefined;
        billingDetail: undefined;
        billingDetailError: undefined;
        billingForm: undefined;
        submitBillingError: undefined;
      };
    }
  | {
      value: { billingFormIdle: "getBillingDetailDataError" };
      context: Context & {
        billings: Billing[];
        billingError: undefined;
        formMode: undefined;
        members: GetMemberListResponse["data"];
        membersError: undefined;
        billingDetail: undefined;
        billingDetailError: string;
        billingForm: undefined;
        submitBillingError: undefined;
      };
    }
  | {
      value: "billingFormReady";
      context: Context & {
        billings: Billing[];
        billingError: undefined;
        formMode: undefined;
        members: GetMemberListResponse["data"];
        membersError: undefined;
        billingDetail: BillingDetail;
        billingDetailError: undefined;
        billingForm: undefined;
        submitBillingError: undefined;
      };
    }
  | {
      value: { billingFormReady: "firstStep" };
      context: Context & {
        billings: Billing[];
        billingError: undefined;
        formMode: undefined;
        members: GetMemberListResponse["data"];
        membersError: undefined;
        billingDetail: BillingDetail;
        billingDetailError: undefined;
        billingForm: BillingForm & {
          title: string;
          total: number;
          chargedMember: string;
        };
        submitBillingError: undefined;
      };
    }
  | {
      value: { billingFormReady: "secondStep" };
      context: Context & {
        billings: Billing[];
        billingError: undefined;
        formMode: undefined;
        members: GetMemberListResponse["data"];
        membersError: undefined;
        billingDetail: BillingDetail;
        billingDetailError: undefined;
        billingForm: BillingForm & {
          title: string;
          total: number;
          chargedMember: string;
          isBillEqual: boolean;
          members: BillingDetailMember[];
        };
        submitBillingError: undefined;
      };
    }
  | {
      value: "submitBilling";
      context: Context & {
        billings: Billing[];
        billingError: undefined;
        formMode: undefined;
        members: GetMemberListResponse["data"];
        membersError: undefined;
        billingDetail: BillingDetail;
        billingDetailError: undefined;
        billingForm: BillingForm & {
          title: string;
          total: number;
          chargedMember: string;
          isBillEqual: boolean;
          members: BillingDetailMember[];
        };
        submitBillingError: undefined;
      };
    }
  | {
      value: "submitBillingOK";
      context: Context & {
        billings: Billing[];
        billingError: undefined;
        formMode: undefined;
        members: GetMemberListResponse["data"];
        membersError: undefined;
        billingDetail: BillingDetail;
        billingDetailError: undefined;
        billingForm: BillingForm & {
          title: string;
          total: number;
          chargedMember: string;
          isBillEqual: boolean;
          members: BillingDetailMember[];
        };
        submitBillingError: undefined;
      };
    }
  | {
      value: "submitBillingError";
      context: Context & {
        billings: Billing[];
        billingError: undefined;
        formMode: undefined;
        members: GetMemberListResponse["data"];
        membersError: undefined;
        billingDetail: BillingDetail;
        billingDetailError: undefined;
        billingForm: BillingForm & {
          title: string;
          total: number;
          chargedMember: string;
          isBillEqual: boolean;
          members: BillingDetailMember[];
        };
        submitBillingError: string;
      };
    };

// Todo => Will be handle on the next PR
type MachineEvents =
  | { type: "FETCH_BILLING" }
  | { type: "FETCH_BILLING" }
  | { type: "FETCH_BILLING" }
  | { type: "FETCH_BILLING" }
  | { type: "FETCH_BILLING" }
  | { type: "FETCH_BILLING" };

export const billingMachine = createMachine<Context>({
  id: "billing",
  initial: "idle",
  context: {
    billings: undefined,
    billingError: "",
    formMode: undefined,
    members: undefined,
    membersError: undefined,
    billingDetail: undefined,
    billingDetailError: "",
    billingForm: undefined,
    submitBillingError: undefined,
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
          actions: "assignBillingsData",
        },
        FETCH_BILLING_ERROR: {
          target: "getBillingError",
          actions: "assignBillingsErrorMessage",
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
              actions: "assignMembersData",
            },
            FETCH_MEMBER_ERROR: {
              target: "getMembersError",
              actions: "assigMembersError",
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
              actions: "assignBillingDetail",
            },
            FETCH_BILLING_DETAIL_ERROR: {
              target: "getBillingDetailDataError",
              actions: "assignBillingDetailErrorMessage",
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
            NEXT_STEP: "secondStep",
          },
        },
        secondStep: {
          on: {
            PREV_STEP: {
              target: "firstStep",
            },
            SUBMIT_BILLING: {
              target: "#billing.submitBilling",
            },
          },
        },
      },
    },
    submitBilling: {
      on: {
        SUBMIT_BILLING_SUCCES: {
          target: "submitBillingOK",
        },
        SUBMIT_BILLING_ERROR: {
          target: "submitBillingError",
          actions: "assignSubmitBillingError",
        },
      },
    },
    submitBillingOK: {
      on: {
        BACK_TO_BILLING_SCREEN: {
          target: "getBillingOK",
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
    assignBillingsData: assign({
      billings: (ctx, event) => event.billingsData,
    }),
    assignBillingsErrorMessage: assign({
      billingError: (ctx, event) => event.billingsErrorMessage,
    }),
    assignBillingDetail: assign({
      billingDetail: (ctx, event) => event.billingDetailData,
    }),
    assignBillingDetailErrorMessage: assign({
      billingDetailError: (ctx, event) => event.billingDetailErrorMessage,
    }),
    assignMembersData: assign({
      members: (ctx, event) => event.membersData,
    }),
    assigMembersError: assign({
      membersError: (ctx, event) => event.membersErrorMessage,
    }),
    assignSubmitBillingError: assign({
      submitBillingError: (ctx, event) => event.submitBillingErrorMessage,
    }),
  },
  guards: {
    isCreatingForm: (ctx) => ctx.formMode === "CREATE",
  },
});
