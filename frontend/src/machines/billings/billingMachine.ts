import { createMachine, assign } from "xstate";
import {
  Member,
  Billing,
  BillingDetail,
  BillingMember,
  membersApi,
  billingsApi,
} from "../../utils/fetcher";
import { queryClient } from "../../pages/_app";

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

export interface Context {
  billings: Billing[];
  billingError: string | null;
  formMode: FormMode;
  members: Member[];
  membersError: string | null;
  billingDetail?: BillingDetail;
  billingDetailError: string | null;
  billingForm?: BillingForm;
  submitBillingDetailError: string | null;
}

export namespace State {
  export namespace Idle {
    export type t = {
      value: "idle";
      context: Context;
    };
  }

  export namespace LoadingBillings {
    export type t = {
      value: "loadingBillings";
      context: Context;
    };
  }
  export namespace GetBillingsOK {
    export type t = {
      value: "getBillingsOK";
      context: Context;
    };

    export const make = (context: Context, billings: Billing[]): t => ({
      value: "getBillingsOK",
      context: {
        ...context,
        billings,
      },
    });
  }

  export namespace GetBillingsError {
    export type t = {
      value: "getBillingsError";
      context: Context & {
        billingError: string;
      };
    };

    export const make = (context: Context, billingError: string): t => ({
      value: "getBillingsError",
      context: {
        ...context,
        billingError,
      },
    });
  }

  export namespace BillingFormIdle {
    export type t = {
      value: "billingFormIdle";
      context: Context;
    };

    export const make = (context: Context, formMode: FormMode): t => ({
      value: "billingFormIdle",
      context: {
        ...context,
        formMode,
      },
    });
  }

  export namespace BillingFormIdleLoadingMembers {
    export type t = {
      value: { billingFormIdle: "loadingMembers" };
      context: Context;
    };
  }

  export namespace BillingFormIdleGetMembersError {
    export type t = {
      value: { billingFormIdle: "getMembersError" };
      context: Context & {
        membersError: string;
      };
    };

    export const make = (context: Context, membersError: string): t => ({
      value: { billingFormIdle: "getMembersError" },
      context: {
        ...context,
        membersError,
      },
    });
  }

  export namespace BillingFormIdleGetBillingDetailCondition {
    export type t = {
      value: { billingFormIdle: "getBillingDetailCondition" };
      context: Context;
    };

    export const make = (context: Context, members: Member[]): t => ({
      value: { billingFormIdle: "getBillingDetailCondition" },
      context: {
        ...context,
        members,
      },
    });
  }

  export namespace BillingFormIdleGetBillingDetailData {
    export type t = {
      value: { billingFormIdle: "getBillingDetailData" };
      context: Context & {
        billingDetail: BillingDetail;
        billingForm: BillingForm;
      };
    };

    export const make = (
      context: Context,
      billingDetail: BillingDetail
    ): t => ({
      value: { billingFormIdle: "getBillingDetailData" },
      context: {
        ...context,
        billingDetail,
        billingForm: {
          title: billingDetail.title,
          total: billingDetail.bill_amount,
          chargedMember: billingDetail.charged_member_id,
          isBillEqual: billingDetail.is_bill_equally,
          members: billingDetail.members,
        },
      },
    });
  }

  export namespace BillingFormIdleGetBillingDetailDataError {
    export type t = {
      value: { billingFormIdle: "getBillingDetailDataError" };
      context: Context & {
        billingDetailError: string;
      };
    };

    export const make = (context: Context, billingDetailError: string): t => ({
      value: { billingFormIdle: "getBillingDetailDataError" },
      context: {
        ...context,
        billingDetailError,
      },
    });
  }

  export namespace BillingFormReady {
    export type t = {
      value: "billingFormReady";
      context: Context;
    };
  }

  export namespace BillingFormReadyFirstStep {
    export type t = {
      value: { billingFormReady: "firstStep" };
      context: Context & {
        billingForm: BillingForm;
      };
    };

    export const make = (context: Context, billingForm: BillingForm): t => ({
      value: { billingFormReady: "firstStep" },
      context: {
        ...context,
        billingForm,
      },
    });
  }

  export namespace BillingFormReadySecondStep {
    export type t = {
      value: { billingFormReady: "secondStep" };
      context: Context & {
        billingForm: BillingForm;
      };
    };

    export const make = (context: Context, billingForm: BillingForm): t => ({
      value: { billingFormReady: "secondStep" },
      context: {
        ...context,
        billingForm,
      },
    });
  }

  export namespace SubmitBilling {
    export type t = {
      value: "submitBilling";
      context: Context;
    };
  }

  export namespace SubmitBillingOK {
    export type t = {
      value: "submitBillingOK";
      context: Context;
    };
  }

  export namespace SubmitBillingError {
    export type t = {
      value: "submitBillingError";
      context: Context & {
        submitBillingDetailError: string;
      };
    };

    export const make = (
      context: Context,
      submitBillingDetailError: string
    ): t => ({
      value: "submitBillingError",
      context: {
        ...context,
        submitBillingDetailError,
      },
    });
  }

  export type t =
    | Idle.t
    | LoadingBillings.t
    | GetBillingsOK.t
    | GetBillingsError.t
    | BillingFormIdle.t
    | BillingFormIdleLoadingMembers.t
    | BillingFormIdleGetMembersError.t
    | BillingFormIdleGetBillingDetailCondition.t
    | BillingFormIdleGetBillingDetailData.t
    | BillingFormIdleGetBillingDetailDataError.t
    | BillingFormReady.t
    | BillingFormReadyFirstStep.t
    | BillingFormReadySecondStep.t
    | SubmitBilling.t
    | SubmitBillingOK.t
    | SubmitBillingError.t;
}

export type Event =
  | { type: "FETCH_BILLINGS" }
  | { type: "FETCH_BILLINGS_SUCCES"; billingsData: Billing[] }
  | { type: "FETCH_BILLINGS_ERROR"; billingsErrorMessage: string }
  | { type: "ACTIVATE_BILLING_FORM"; formMode: FormMode }
  | { type: "REFETCH_BILLINGS" }
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
  | { type: "SUBMIT_BILLING_ERROR"; submitBillingDetailErrorMessage: string }
  | { type: "BACK_TO_BILLING_SCREEN" }
  | { type: "BACK_TO_SECOND_STEP_FORM" }
  | { type: "REFETCH_SUBMIT_BILLING" };

export const billingMachine = createMachine<Context, Event, State.t>({
  schema: {
    context: {} as Context,
    events: {} as Event,
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
    submitBillingDetailError: null,
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
          actions: assign(
            (context, event) =>
              State.GetBillingsOK.make(context, event.billingsData).context
          ),
        },
        FETCH_BILLING_ERROR: {
          target: "getBillingsError",
          actions: assign(
            (context, event) =>
              State.GetBillingsError.make(context, event.billingsErrorMessage)
                .context
          ),
        },
      },
    },
    getBillingsOK: {
      on: {
        ACTIVATE_BILLING_FORM: {
          target: "billingFormIdle",
          actions: assign(
            (context, event) =>
              State.BillingFormIdle.make(context, event.formMode).context
          ),
        },
      },
    },
    getBillingsError: {
      on: {
        REFETCH_BILLINGS: "loadingBillings",
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
              actions: assign(
                (context, event) =>
                  State.BillingFormIdleGetBillingDetailCondition.make(
                    context,
                    event.membersData
                  ).context
              ),
            },
            FETCH_MEMBERS_ERROR: {
              target: "getMembersError",
              actions: assign(
                (context, event) =>
                  State.BillingFormIdleGetMembersError.make(
                    context,
                    event.membersErrorMessage
                  ).context
              ),
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
              actions: assign(
                (context, event) =>
                  State.BillingFormIdleGetBillingDetailData.make(
                    context,
                    event.billingDetailData
                  ).context
              ),
            },
            FETCH_BILLING_DETAIL_ERROR: {
              target: "getBillingDetailDataError",
              actions: assign(
                (context, event) =>
                  State.BillingFormIdleGetBillingDetailDataError.make(
                    context,
                    event.billingDetailErrorMessage
                  ).context
              ),
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
              actions: assign(
                (context, event) =>
                  State.BillingFormReadyFirstStep.make(
                    context,
                    event.billingForm
                  ).context
              ),
            },
          },
        },
        secondStep: {
          on: {
            PREV_STEP: "firstStep",
            UPDATE_FORM: {
              actions: assign(
                (context, event) =>
                  State.BillingFormReadySecondStep.make(
                    context,
                    event.billingForm
                  ).context
              ),
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
          actions: assign(
            (context, event) =>
              State.SubmitBillingError.make(
                context,
                event.submitBillingErrorMessage
              ).context
          ),
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
    submitBillingDetailError: {
      on: {
        BACK_TO_SECOND_STEP_FORM: "billingFormReady.secondStep",
        REFETCH_SUBMIT_BILLING: "submitBilling",
      },
    },
  },
}).withConfig({
  guards: {
    isCreatingForm: (ctx) => ctx.formMode === "CREATE",
  },
});
