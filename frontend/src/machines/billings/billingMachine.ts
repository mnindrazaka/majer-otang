import { assign, createMachine } from "xstate";

import { queryClient } from "../../pages/_app";
import {
  Billing,
  BillingDetail,
  BillingMember,
  billingsApi,
  Member,
  membersApi
} from "../../utils/fetcher";

export type BillingForm = {
  title: string;
  billAmount: number;
  chargedMemberId: string;
  isBillEqually: boolean;
  members: BillingMember[];
};

export enum FormMode {
  Create = "CREATE",
  Edit = "EDIT"
}

export interface Context {
  billings: Billing[];
  billingError: string | null;
  formMode: FormMode;
  members: Member[];
  membersError: string | null;
  billingDetail?: BillingDetail;
  selectedBillingId: string | null;
  billingDetailError: string | null;
  billingForm?: BillingForm;
  submitBillingDetailError: string | null;
}

export namespace State {
  export namespace Idle {
    export type t = {
      value: "idle";
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: undefined;
        selectedBillingId: null;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingDetailError: null;
      };
    };
  }

  export namespace LoadingBillings {
    export type t = {
      value: "loadingBillings";
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: undefined;
        selectedBillingId: null;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingDetailError: null;
      };
    };

    export const make = (context: Context): t => ({
      value: "loadingBillings",
      context: {
        ...context,
        billingError: null,
        membersError: null,
        billingDetail: undefined,
        selectedBillingId: null,
        billingDetailError: null,
        billingForm: undefined,
        submitBillingDetailError: null
      }
    });
  }
  export namespace GetBillingsOK {
    export type t = {
      value: "getBillingsOK";
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: undefined;
        selectedBillingId: null;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingDetailError: null;
      };
    };

    export const make = (context: Context, billings: Billing[]): t => ({
      value: "getBillingsOK",
      context: {
        ...context,
        billingError: null,
        billings,
        membersError: null,
        billingDetail: undefined,
        selectedBillingId: null,
        billingDetailError: null,
        billingForm: undefined,
        submitBillingDetailError: null
      }
    });
  }

  export namespace GetBillingsError {
    export type t = {
      value: "getBillingsError";
      context: Context & {
        billingError: string;
        membersError: null;
        billingDetail: undefined;
        selectedBillingId: null;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingDetailError: null;
      };
    };

    export const make = (context: Context, billingError: string): t => ({
      value: "getBillingsError",
      context: {
        ...context,
        billingError,
        membersError: null,
        billingDetail: undefined,
        selectedBillingId: null,
        billingDetailError: null,
        billingForm: undefined,
        submitBillingDetailError: null
      }
    });
  }

  export namespace BillingFormIdle {
    export type t = {
      value: "billingFormIdle";
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: undefined;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingDetailError: null;
      };
    };

    export const make = (
      context: Context,
      formMode: FormMode,
      billingId: string | null
    ): t => ({
      value: "billingFormIdle",
      context: {
        ...context,
        formMode,
        billingError: null,
        membersError: null,
        billingDetail: undefined,
        selectedBillingId: billingId,
        billingDetailError: null,
        billingForm: undefined,
        submitBillingDetailError: null
      }
    });
  }

  export namespace BillingFormIdleLoadingMembers {
    export type t = {
      value: { billingFormIdle: "loadingMembers" };
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: undefined;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingDetailError: null;
      };
    };

    export const make = (context: Context): t => ({
      value: { billingFormIdle: "loadingMembers" },
      context: {
        ...context,
        billingError: null,
        membersError: null,
        billingDetail: undefined,
        billingDetailError: null,
        billingForm: undefined,
        submitBillingDetailError: null
      }
    });
  }

  export namespace BillingFormIdleGetMembersError {
    export type t = {
      value: { billingFormIdle: "getMembersError" };
      context: Context & {
        billingError: null;
        membersError: string;
        billingDetail: undefined;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingDetailError: null;
      };
    };

    export const make = (context: Context, membersError: string): t => ({
      value: { billingFormIdle: "getMembersError" },
      context: {
        ...context,
        membersError,
        billingError: null,
        billingDetail: undefined,
        billingDetailError: null,
        billingForm: undefined,
        submitBillingDetailError: null
      }
    });
  }

  export namespace BillingFormIdleGetBillingDetailCondition {
    export type t = {
      value: { billingFormIdle: "getBillingDetailCondition" };
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: undefined;
        billingDetailError: null;
        billingForm: BillingForm;
        submitBillingDetailError: null;
      };
    };

    export const make = (context: Context, members: Member[]): t => ({
      value: { billingFormIdle: "getBillingDetailCondition" },
      context: {
        ...context,
        members,
        billingError: null,
        membersError: null,
        billingDetail: undefined,
        billingDetailError: null,
        billingForm: {
          billAmount: 0,
          chargedMemberId: "",
          isBillEqually: true,
          members: [],
          title: ""
        },
        submitBillingDetailError: null
      }
    });
  }

  export namespace BillingFormIdleLoadingBillingDetailData {
    export type t = {
      value: { billingFormIdle: "loadingBillingDetailData" };
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetailError: null;
        submitBillingDetailError: null;
      };
    };

    export const make = (context: Context): t => ({
      value: { billingFormIdle: "loadingBillingDetailData" },
      context: {
        ...context,
        billingError: null,
        membersError: null,
        billingDetailError: null,
        submitBillingDetailError: null
      }
    });
  }

  export namespace BillingFormIdleGetBillingDetailDataError {
    export type t = {
      value: { billingFormIdle: "getBillingDetailDataError" };
      context: Context & {
        billingDetailError: string;
        billingError: null;
        membersError: null;
        billingDetail: undefined;
        billingForm: undefined;
        submitBillingDetailError: null;
      };
    };

    export const make = (context: Context, billingDetailError: string): t => ({
      value: { billingFormIdle: "getBillingDetailDataError" },
      context: {
        ...context,
        billingDetailError,
        membersError: null,
        billingError: null,
        billingDetail: undefined,
        billingForm: undefined,
        submitBillingDetailError: null
      }
    });
  }

  export namespace BillingFormReady {
    export type t = {
      value: "billingFormReady";
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: BillingDetail;
        billingDetailError: null;
        billingForm: BillingForm;
        submitBillingDetailError: null;
      };
    };

    export const make = (
      context: Context,
      billingDetail: BillingDetail
    ): t => ({
      value: "billingFormReady",
      context: {
        ...context,
        billingDetail,
        billingForm: {
          title: billingDetail.title,
          billAmount: billingDetail.billAmount,
          chargedMemberId: billingDetail.memberId,
          isBillEqually: billingDetail.isBillEqually,
          members: billingDetail.members
        },
        billingError: null,
        membersError: null,
        billingDetailError: null,
        submitBillingDetailError: null
      }
    });
  }

  export namespace BillingFormReadyFirstStep {
    export type t = {
      value: { billingFormReady: "firstStep" };
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetailError: null;
        billingForm: BillingForm;
        submitBillingDetailError: null;
      };
    };
  }

  export namespace BillingFormUpdate {
    export type t = {
      value: "billingFormReady";
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetailError: null;
        billingForm: BillingForm;
        submitBillingDetailError: null;
      };
    };

    export const update = (context: Context, billingForm: BillingForm): t => ({
      value: "billingFormReady",
      context: {
        ...context,
        billingForm,
        billingError: null,
        membersError: null,
        billingDetailError: null,
        submitBillingDetailError: null
      }
    });
  }

  export namespace BillingFormReadySecondStep {
    export type t = {
      value: { billingFormReady: "secondStep" };
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetailError: null;
        billingForm: BillingForm;
        submitBillingDetailError: null;
      };
    };
  }

  export namespace SubmitBilling {
    export type t = {
      value: "submitBilling";
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetailError: null;
        submitBillingDetailError: null;
      };
    };

    export const make = (context: Context): t => ({
      value: "submitBilling",
      context: {
        ...context,
        billingError: null,
        membersError: null,
        billingDetailError: null,
        submitBillingDetailError: null
      }
    });
  }

  export namespace SubmitBillingOK {
    export type t = {
      value: "submitBillingOK";
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetailError: null;
        submitBillingDetailError: null;
      };
    };
  }

  export namespace SubmitBillingError {
    export type t = {
      value: "submitBillingError";
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetailError: null;
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
        billingError: null,
        membersError: null,
        billingDetailError: null
      }
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
    | BillingFormIdleLoadingBillingDetailData.t
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
  | { type: "FETCH_BILLINGS_SUCCESS"; billingsData: Billing[] }
  | { type: "FETCH_BILLINGS_ERROR"; billingsErrorMessage: string }
  | {
      type: "ACTIVATE_BILLING_FORM";
      formMode: FormMode;
      billingId: string | null;
    }
  | { type: "REFETCH_BILLINGS" }
  | { type: "FETCH_MEMBERS_SUCCESS"; membersData: Member[] }
  | { type: "FETCH_MEMBERS_ERROR"; membersErrorMessage: string }
  | { type: "REFETCH_MEMBERS" }
  | { type: "FETCH_BILLING_DETAIL_SUCCESS"; billingDetailData: BillingDetail }
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
  | { type: "SUBMIT_BILLING_SUCCESS" }
  | { type: "SUBMIT_BILLING_ERROR"; submitBillingDetailErrorMessage: string }
  | { type: "BACK_TO_BILLING_SCREEN" }
  | { type: "BACK_TO_SECOND_STEP_FORM" }
  | { type: "REFETCH_SUBMIT_BILLING" };

export const billingMachine = createMachine<Context, Event, State.t>({
  schema: {
    context: {} as Context,
    events: {} as Event
  },
  id: "billing",
  initial: "idle",
  context: {
    billings: [],
    billingError: null,
    formMode: FormMode.Create,
    selectedBillingId: null,
    members: [],
    membersError: null,
    billingDetail: undefined,
    billingDetailError: null,
    submitBillingDetailError: null,
    billingForm: undefined
  },
  states: {
    idle: {
      invoke: {
        src: "initMachineTransition"
      },
      on: {
        FETCH_BILLINGS: "loadingBillings"
      }
    },
    loadingBillings: {
      invoke: {
        src: "getBillingsData"
      },
      on: {
        FETCH_BILLINGS_SUCCESS: {
          target: "getBillingsOK",
          actions: assign(
            (context, event) =>
              State.GetBillingsOK.make(context, event.billingsData).context
          )
        },
        FETCH_BILLINGS_ERROR: {
          target: "getBillingsError",
          actions: assign(
            (context, event) =>
              State.GetBillingsError.make(context, event.billingsErrorMessage)
                .context
          )
        }
      }
    },
    getBillingsOK: {
      on: {
        ACTIVATE_BILLING_FORM: {
          target: "billingFormIdle",
          actions: assign(
            (context, event) =>
              State.BillingFormIdle.make(
                context,
                event.formMode,
                event.billingId
              ).context
          )
        }
      }
    },
    getBillingsError: {
      on: {
        REFETCH_BILLINGS: {
          target: "loadingBillings",
          actions: assign(
            (context) => State.LoadingBillings.make(context).context
          )
        }
      }
    },
    billingFormIdle: {
      initial: "loadingMembers",
      states: {
        loadingMembers: {
          invoke: {
            src: "getMembersData"
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
              )
            },
            FETCH_MEMBERS_ERROR: {
              target: "getMembersError",
              actions: assign(
                (context, event) =>
                  State.BillingFormIdleGetMembersError.make(
                    context,
                    event.membersErrorMessage
                  ).context
              )
            }
          }
        },
        getMembersError: {
          on: {
            REFETCH_MEMBERS: {
              target: "loadingMembers",
              actions: assign(
                (context) =>
                  State.BillingFormIdleLoadingMembers.make(context).context
              )
            }
          }
        },
        getBillingDetailCondition: {
          always: [
            {
              cond: "isCreatingForm",
              target: "#billing.billingFormReady"
            },
            {
              target: "loadingBillingDetailData"
            }
          ]
        },
        loadingBillingDetailData: {
          invoke: {
            src: "getBillingDetailData"
          },
          on: {
            FETCH_BILLING_DETAIL_SUCCESS: {
              target: "#billing.billingFormReady",
              actions: assign(
                (context, event) =>
                  State.BillingFormReady.make(context, event.billingDetailData)
                    .context
              )
            },
            FETCH_BILLING_DETAIL_ERROR: {
              target: "getBillingDetailDataError",
              actions: assign(
                (context, event) =>
                  State.BillingFormIdleGetBillingDetailDataError.make(
                    context,
                    event.billingDetailErrorMessage
                  ).context
              )
            }
          }
        },
        getBillingDetailDataError: {
          on: {
            REFETCH_BILLING_DETAIL: {
              target: "loadingBillingDetailData",
              actions: assign(
                (context) =>
                  State.BillingFormIdleLoadingBillingDetailData.make(context)
                    .context
              )
            }
          }
        }
      }
    },
    billingFormReady: {
      initial: "firstStep",
      states: {
        firstStep: {
          on: {
            NEXT_STEP: {
              target: "secondStep"
            }
          }
        },
        secondStep: {
          on: {
            PREV_STEP: "firstStep",
            SUBMIT_BILLING: "#billing.submitBilling"
          }
        }
      },
      on: {
        CANCEL_FILL_FORM: "getBillingsOK",
        UPDATE_FORM: {
          actions: assign(
            (context, event) =>
              State.BillingFormUpdate.update(context, event.billingForm).context
          )
        }
      }
    },
    submitBilling: {
      invoke: {
        src: "submitBillingData"
      },
      on: {
        SUBMIT_BILLING_SUCCESS: {
          target: "submitBillingOK"
        },
        SUBMIT_BILLING_ERROR: {
          target: "submitBillingError",
          actions: assign(
            (context, event) =>
              State.SubmitBillingError.make(
                context,
                event.submitBillingDetailErrorMessage
              ).context
          )
        }
      }
    },
    submitBillingOK: {
      on: {
        BACK_TO_BILLING_SCREEN: {
          target: "loadingBillings"
        }
      }
    },
    submitBillingError: {
      on: {
        BACK_TO_SECOND_STEP_FORM: "billingFormReady.secondStep",
        REFETCH_SUBMIT_BILLING: {
          target: "submitBilling",
          actions: assign(
            (context) => State.SubmitBilling.make(context).context
          )
        }
      }
    }
  }
}).withConfig({
  services: {
    initMachineTransition: () => (send) => {
      send({ type: "FETCH_BILLINGS" });
    },
    getBillingsData: () => (send) => {
      queryClient
        .fetchQuery("billings", () => billingsApi.getBillingList())
        .then((response) =>
          send({ type: "FETCH_BILLINGS_SUCCESS", billingsData: response.data })
        )
        .catch((error) =>
          send({
            type: "FETCH_BILLINGS_ERROR",
            billingsErrorMessage: error.message
          })
        );
    },
    getMembersData: () => (send) => {
      queryClient
        .fetchQuery("members", () => membersApi.getMemberList())
        .then((response) =>
          send({ type: "FETCH_MEMBERS_SUCCESS", membersData: response.data })
        )
        .catch((error) =>
          send({
            type: "FETCH_MEMBERS_ERROR",
            membersErrorMessage: error.message
          })
        );
    },
    getBillingDetailData: (ctx) => (send) => {
      queryClient
        .fetchQuery("billingId", () =>
          billingsApi.getBillingByID({ billingId: ctx.selectedBillingId ?? "" })
        )
        .then((response) =>
          send({
            type: "FETCH_BILLING_DETAIL_SUCCESS",
            billingDetailData: response.data
          })
        )
        .catch((error) =>
          send({
            type: "FETCH_BILLING_DETAIL_ERROR",
            billingDetailErrorMessage: error.message
          })
        );
    },
    submitBillingData: (ctx) => (send) => {
      const { title, billAmount, chargedMemberId, isBillEqually, members } =
        ctx.billingForm ?? {
          title: "",
          billAmount: 0,
          chargedMemberId: "",
          isBillEqually: true,
          members: []
        };

      ctx.formMode === FormMode.Create
        ? billingsApi
            .createBilling({
              billingRequest: {
                title,
                billAmount,
                chargedMemberId,
                isBillEqually,
                members
              }
            })
            .then((response) => {
              send({ type: "SUBMIT_BILLING_SUCCESS" });
              response;
            })
            .catch((err) =>
              send({
                type: "SUBMIT_BILLING_ERROR",
                submitBillingDetailErrorMessage: err.message
              })
            )
        : billingsApi
            .updateBilling({
              billingId: ctx.selectedBillingId ?? "",
              billingRequest: {
                title,
                billAmount,
                chargedMemberId,
                isBillEqually,
                members
              }
            })
            .then((response) => {
              send({ type: "SUBMIT_BILLING_SUCCESS" });
              response;
            })
            .catch((err) =>
              send({
                type: "SUBMIT_BILLING_ERROR",
                submitBillingDetailErrorMessage: err.message
              })
            );
    }
  },
  guards: {
    isCreatingForm: (ctx) => ctx.formMode === "CREATE"
  }
});
