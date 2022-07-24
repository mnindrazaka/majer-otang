import { createMachine, assign } from "xstate";
import { Member } from "../../utils/fetcher";

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
  title?: string;
  total?: number;
  chargedMember?: string;
  isBillEqual: boolean;
  members?: Member[];
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
          members: BillingDetailMember[];
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
          members: BillingDetailMember[];
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
          members: BillingDetailMember[];
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
          members: BillingDetailMember[];
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
  | {
      type: "NEXT_STEP";
      billingName: string;
      total: number;
      chargedMember: string;
    }
  | { type: "PREV_STEP" }
  | {
      type: "SUBMIT_BILLING";
      isBillEqual: boolean;
      members: Member[];
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
            NEXT_STEP: {
              actions: "fillTheFirstForm",
              target: "secondStep",
            },
          },
        },
        secondStep: {
          on: {
            PREV_STEP: "firstStep",
            SUBMIT_BILLING: {
              target: "#billing.submitBilling",
              actions: "fillTheSecondForm",
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
      billings: (ctx, event) =>
        event.type === "FETCH_BILLING_SUCCES"
          ? event.billingsData
          : ctx.billings,
    }),
    assignBillingsErrorMessage: assign({
      billingError: (ctx, event) =>
        event.type === "FETCH_BILLING_ERROR"
          ? event.billingsErrorMessage
          : ctx.billingError,
    }),
    assignBillingDetail: assign({
      billingDetail: (ctx, event) =>
        event.type === "FETCH_BILLING_DETAIL_SUCCES"
          ? event.billingDetailData
          : ctx.billingDetail,
    }),
    assignBillingDetailErrorMessage: assign({
      billingDetailError: (ctx, event) =>
        event.type === "FETCH_BILLING_DETAIL_ERROR"
          ? event.billingDetailErrorMessage
          : ctx.billingDetailError,
    }),
    assignMembersData: assign({
      members: (ctx, event) =>
        event.type === "FETCH_MEMBER_SUCCESS" ? event.membersData : ctx.members,
    }),
    assigMembersError: assign({
      membersError: (ctx, event) =>
        event.type === "FETCH_MEMBER_ERROR"
          ? event.membersErrorMessage
          : ctx.membersError,
    }),
    fillTheFirstForm: assign({
      billingForm: (ctx, event) => {
        if (event.type === "NEXT_STEP") {
          return {
            title: event.billingName,
            total: event.total,
            chargedMember: event.chargedMember,
            isBillEqual: true,
            members: [],
          };
        }
      },
    }),
    fillTheSecondForm: assign({
      billingForm: (ctx, event) => {
        if (event.type === "SUBMIT_BILLING") {
          return {
            title: ctx.billingForm?.title,
            total: ctx.billingForm?.total,
            chargedMember: ctx.billingForm?.chargedMember,
            isBillEqual: event.isBillEqual,
            members: event.members,
          };
        }
      },
    }),
    assignSubmitBillingError: assign({
      submitBillingError: (ctx, event) =>
        event.type === "SUBMIT_BILLING_ERROR"
          ? event.submitBillingErrorMessage
          : ctx.submitBillingError,
    }),
  },
  guards: {
    isCreatingForm: (ctx) => ctx.formMode === "CREATE",
  },
});
