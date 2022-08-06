import { assign, createMachine } from "xstate";
import { Member } from "../__generated__/api";
import { match } from "ts-pattern";

interface Context {
  memberDetail: Member[];
  memberDetailError: string | null;
  payments: [];
  paymentsError: string | null;
  submitPayment: [];
  submitPaymetError: string | null;
}

type MachineState =
  | {
      value: "idle";
      context: Context & {
        memberError: null;
        paymentsError: null;
        submitPaymetError: null;
      };
    }
  | {
      value: "fetchingMemberDetail";
      context: Context & {
        memberError: null;
        paymentsError: null;
      };
    }
  | {
      value: "fetchingMemberDetailError";
      context: Context & {
        memberError: string;
        paymentsError: null;
      };
    }
  | {
      value: "fetchingMemberDetailSucces";
      context: Context & {
        memberError: null;
        paymentsError: null;
        submitPaymetError: null;
      };
    }
  | {
      value: "fetchingPayment";
      context: Context & {
        memberError: null;
        paymentsError: null;
        submitPaymetError: null;
      };
    }
  | {
      value: "fetchingPaymentError";
      context: Context & {
        memberError: null;
        paymentsError: string;
      };
    }
  | {
      value: "fetchingPaymentSuccess";
      context: Context & {
        memberError: null;
        paymentsError: null;
        submitPaymetError: null;
      };
    }
  | {
      value: "confirmingPayment";
      context: Context & {
        memberError: null;
        paymentsError: null;
        submitPaymetError: null;
      };
    }
  | {
      value: "submittingPayment";
      context: Context & {
        memberError: null;
        paymentsError: null;
        submitPaymetError: null;
      };
    }
  | {
      value: "submittingPaymentError";
      context: Context & {
        memberError: null;
        paymentsError: null;
        submitPaymetError: string;
      };
    };

type MachineEvents =
  | { type: "FETCH_MEMBER_DETAIL" }
  | { type: "FETCH_MEMBER_DETAIL_SUCCESS"; memberDetailData: Member[] }
  | { type: "FETCH_MEMBER_DETAIL_ERROR"; memberDetailErrorMessage: string }
  | { type: "REFETCH_MEMBER_DETAIL" }
  | { type: "FETCH_PAYMENT" }
  | { type: "FETCH_PAYMENT_SUCCESS"; paymentsData: [] }
  | { type: "FETCH_PAYMENT_ERROR"; paymentErrorMessage: string }
  | { type: "REFETCH_PAYMENT" }
  | { type: "SELECT_PAYMENT_TARGET" }
  | { type: "CANCEL_PAYMENT" }
  | { type: "CONFIRM_PAYMENT" }
  | { type: "SUBMIT_PAYMENT_SUCCESS" }
  | { type: "SUBMIT_PAYMENT_ERROR"; submitPaymentErrorMessage: string }
  | { type: "RESUBMIT_PAYMENT" };

export const paymentMachine = createMachine<
  Context,
  MachineEvents,
  MachineState
>({
  id: "Payment",
  initial: "idle",
  schema: {
    context: {} as Context,
    events: {} as MachineEvents
  },
  context: {
    memberDetail: [],
    memberDetailError: null,
    payments: [],
    paymentsError: null,
    submitPayment: [],
    submitPaymetError: null
  },
  states: {
    idle: {
      on: {
        FETCH_MEMBER_DETAIL: {
          target: "fetchingMemberDetail"
        }
      }
    },
    fetchingMemberDetail: {
      on: {
        FETCH_MEMBER_DETAIL_SUCCESS: {
          target: "fetchingMemberDetailSuccess",
          actions: "updateContext"
        },
        FETCH_MEMBER_DETAIL_ERROR: {
          target: "fetchingMemberDetailError",
          actions: "updateContext"
        }
      }
    },
    fetchingMemberDetailSuccess: {
      on: {
        FETCH_PAYMENT: {
          target: "fetchingPayment"
        }
      }
    },
    fetchingMemberDetailError: {
      on: {
        REFETCH_MEMBER_DETAIL: {
          target: "fetchingMemberDetail"
        }
      }
    },
    fetchingPayment: {
      on: {
        FETCH_PAYMENT_SUCCESS: {
          target: "fetchingPaymentSuccess",
          actions: "updateContext"
        },
        FETCH_PAYMENT_ERROR: {
          target: "fetchingPaymentError",
          actions: "updateContext"
        }
      }
    },
    fetchingPaymentSuccess: {
      on: {
        SELECT_PAYMENT_TARGET: {
          target: "confirmingPayment"
        }
      }
    },
    fetchingPaymentError: {
      on: {
        REFETCH_PAYMENT: {
          target: "fetchingPayment"
        }
      }
    },
    confirmingPayment: {
      on: {
        CONFIRM_PAYMENT: {
          target: "submittingPayment"
        },
        CANCEL_PAYMENT: {
          target: "fetchingPaymentSuccess"
        }
      }
    },
    submittingPayment: {
      on: {
        SUBMIT_PAYMENT_ERROR: {
          target: "submittingPaymentError",
          actions: "updateContext"
        },
        SUBMIT_PAYMENT_SUCCESS: {
          target: "fetchingPayment",
          actions: "updateContext"
        }
      }
    },
    submittingPaymentError: {
      on: {
        RESUBMIT_PAYMENT: {
          target: "submittingPayment"
        },
        CANCEL_PAYMENT: {
          target: "fetchingPaymentSuccess"
        }
      }
    }
  }
}).withConfig({
  actions: {
    updateContext: assign((ctx, event) =>
      match(event)
        .with({ type: "FETCH_MEMBER_DETAIL" }, () => ctx)
        .with({ type: "FETCH_MEMBER_DETAIL_ERROR" }, (event) => ({
          ...ctx,
          memberDetailError: event.memberDetailErrorMessage
        }))
        .with({ type: "REFETCH_MEMBER_DETAIL" }, () => ctx)
        .with({ type: "FETCH_MEMBER_DETAIL_SUCCESS" }, (event) => ({
          ...ctx,
          memberDetail: event.memberDetailData
        }))
        .with({ type: "FETCH_PAYMENT" }, () => ctx)
        .with({ type: "FETCH_PAYMENT_ERROR" }, (event) => ({
          ...ctx,
          paymentsError: event.paymentErrorMessage
        }))
        .with({ type: "REFETCH_PAYMENT" }, () => ctx)
        .with({ type: "FETCH_PAYMENT_SUCCESS" }, (event) => ({
          ...ctx,
          payments: event.paymentsData
        }))
        .with({ type: "SELECT_PAYMENT_TARGET" }, () => ctx)
        .with({ type: "CANCEL_PAYMENT" }, () => ctx)
        .with({ type: "CONFIRM_PAYMENT" }, () => ctx)
        .with({ type: "SUBMIT_PAYMENT_SUCCESS" }, () => ctx)
        .with({ type: "SUBMIT_PAYMENT_ERROR" }, (event) => ({
          ...ctx,
          submitPaymetError: event.submitPaymentErrorMessage
        }))
        .with({ type: "RESUBMIT_PAYMENT" }, () => ctx)
        .exhaustive()
    )
  }
});
