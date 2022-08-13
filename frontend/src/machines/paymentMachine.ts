import { createMachine } from "xstate";

const paymentMachine = createMachine({
  id: "Payment",
  initial: "idle",
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
          target: "fetchingMemberDetailSuccess"
        },
        FETCH_MEMBER_DETAIL_ERROR: {
          target: "fetchingMemberDetailError"
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
          target: "fetchingPaymentSuccess"
        },
        FETCH_PAYMENT_ERROR: {
          target: "fetchingPaymentError"
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
          target: "submittingPaymentError"
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
