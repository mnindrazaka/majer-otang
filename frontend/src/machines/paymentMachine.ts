import { assign, createMachine } from "xstate";
import { Member } from "../__generated__/api";
import { match } from "ts-pattern";

interface Context {
  member: Member;
  memberError: string | null;
  payments: [];
  paymentsError: string | null;
  submitPaymetError: string | null;
}

export namespace State {
  export namespace Idle {
    export type t = {
      value: "idle";
      context: Context & {
        memberError: null;
        paymentsError: null;
        submitPaymetError: null;
      };
    };
  }

  export namespace FetchingMember {
    export type t = {
      value: "fetchingMember";
      context: Context & {
        memberError: null;
        paymentsError: null;
        submitPaymetError: null;
      };
    };

    export const make = (context: Context): t => ({
      value: "fetchingMember",
      context: {
        ...context,
        paymentsError: null,
        memberError: null,
        submitPaymetError: null
      }
    });
  }

  export namespace FetchingMemberSuccess {
    export type t = {
      value: "fetchingMemberSuccess";
      context: Context & {
        memberError: null;
        paymentsError: null;
        submitPaymetError: null;
      };
    };

    export const make = (context: Context, member: Member): t => ({
      value: "fetchingMemberSuccess",
      context: {
        ...context,
        member,
        memberError: null,
        paymentsError: null,
        submitPaymetError: null
      }
    });
  }

  export namespace FetchingMemberError {
    export type t = {
      value: "fetchingMemberError";
      context: Context & {
        memberError: string;
        paymentsError: null;
        submitPaymetError: null;
      };
    };

    export const make = (context: Context, memberError: string): t => ({
      value: "fetchingMemberError",
      context: {
        ...context,
        memberError,
        paymentsError: null,
        submitPaymetError: null
      }
    });
  }

  export namespace FetchingPayment {
    export type t = {
      value: "fetchingPayment";
      context: Context & {
        memberError: null;
        paymentsError: null;
        submitPaymetError: null;
      };
    };

    export const make = (context: Context): t => ({
      value: "fetchingPayment",
      context: {
        ...context,
        paymentsError: null,
        memberError: null,
        submitPaymetError: null
      }
    });
  }

  export namespace FetchingPaymentSuccess {
    export type t = {
      value: "fetchingPaymentSuccess";
      context: Context & {
        memberError: null;
        paymentsError: null;
        submitPaymetError: null;
      };
    };

    export const make = (context: Context, payments: []): t => ({
      value: "fetchingPaymentSuccess",
      context: {
        ...context,
        payments,
        memberError: null,
        paymentsError: null,
        submitPaymetError: null
      }
    });
  }
  export namespace FetchingPaymentError {
    export type t = {
      value: "fetchingPaymentError";
      context: Context & {
        memberError: null;
        paymentsError: string;
        submitPaymetError: null;
      };
    };

    export const make = (context: Context, paymentsError: string): t => ({
      value: "fetchingPaymentError",
      context: {
        ...context,
        paymentsError,
        memberError: null,
        submitPaymetError: null
      }
    });
  }

  export namespace ConfirmingPayment {
    export type t = {
      value: "confirmingPayment";
      context: Context & {
        memberError: null;
        paymentsError: null;
        submitPaymetError: null;
      };
    };
  }

  export namespace SubmittingPayment {
    export type t = {
      value: "submittingPayment";
      context: Context & {
        memberError: null;
        paymentsError: null;
        submitPaymetError: null;
      };
    };
  }

  export namespace SubmittingPaymentError {
    export type t = {
      value: "submittingPaymentError";
      context: Context & {
        memberError: null;
        paymentsError: null;
        submitPaymetError: string;
      };
    };

    export const make = (context: Context, submitPaymetError: string): t => ({
      value: "submittingPaymentError",
      context: {
        ...context,
        paymentsError: null,
        memberError: null,
        submitPaymetError
      }
    });
  }

  export type t =
    | Idle.t
    | FetchingMember.t
    | FetchingMemberError.t
    | FetchingMemberSuccess.t
    | FetchingPayment.t
    | FetchingPaymentSuccess.t
    | FetchingPaymentError.t
    | ConfirmingPayment.t
    | SubmittingPayment.t
    | SubmittingPaymentError.t;
}

type MachineEvents =
  | { type: "FETCH_MEMBER" }
  | { type: "FETCH_MEMBER_SUCCESS"; memberData: Member }
  | { type: "FETCH_MEMBER_ERROR"; memberErrorMessage: string }
  | { type: "REFETCH_MEMBER" }
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

export const paymentMachine = createMachine<Context, MachineEvents, State.t>({
  id: "Payment",
  initial: "idle",
  schema: {
    context: {} as Context,
    events: {} as MachineEvents
  },
  context: {
    member: {
      id: "",
      name: ""
    },
    memberError: null,
    payments: [],
    paymentsError: null,
    submitPaymetError: null
  },
  states: {
    idle: {
      on: {
        FETCH_MEMBER: {
          target: "fetchingMember"
        }
      }
    },
    fetchingMember: {
      on: {
        FETCH_MEMBER_SUCCESS: {
          target: "fetchingMemberSuccess",
          actions: assign(
            (context, event) =>
              State.FetchingMemberSuccess.make(context, event.memberData)
                .context
          )
        },
        FETCH_MEMBER_ERROR: {
          target: "fetchingMemberError",
          actions: assign(
            (context, event) =>
              State.FetchingMemberError.make(context, event.memberErrorMessage)
                .context
          )
        }
      }
    },
    fetchingMemberSuccess: {
      on: {
        FETCH_PAYMENT: {
          target: "fetchingPayment"
        }
      }
    },
    fetchingMemberError: {
      on: {
        REFETCH_MEMBER: {
          target: "fetchingMember"
        }
      }
    },
    fetchingPayment: {
      on: {
        FETCH_PAYMENT_SUCCESS: {
          target: "fetchingPaymentSuccess",
          actions: assign(
            (context, event) =>
              State.FetchingPaymentSuccess.make(context, event.paymentsData)
                .context
          )
        },
        FETCH_PAYMENT_ERROR: {
          target: "fetchingPaymentError",
          actions: assign(
            (context, event) =>
              State.FetchingPaymentError.make(
                context,
                event.paymentErrorMessage
              ).context
          )
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
          actions: assign(
            (context, event) =>
              State.SubmittingPaymentError.make(
                context,
                event.submitPaymentErrorMessage
              ).context
          )
        },
        SUBMIT_PAYMENT_SUCCESS: {
          target: "fetchingPayment"
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
});
