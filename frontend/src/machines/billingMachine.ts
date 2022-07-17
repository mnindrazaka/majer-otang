import { createMachine, assign } from "xstate";

type Billing = {
  id: string;
  title: string;
  amount: number;
};

interface Context {
  billings: Billing[];
  formMode: "CREATE" | "EDIT";
}

const billingMachine = createMachine<Context>({
  id: "billing",
  initial: "idle",
  context: {
    billings: [],
    formMode: "CREATE",
  },
  states: {
    idle: {
      on: {
        FETCH_BILLING: {
          target: "loadingBilling",
        },
      },
    },
    loadingBilling: {
      on: {
        FETCH_BILLING_SUCCES: {
          target: "getBillingOK",
        },
        FETCH_BILLING_ERROR: {
          target: "getBillingError",
        },
      },
    },
    getBillingOK: {
      on: {
        ACTIVATE_BILLING_FORM: {
          target: "billingFormIdle",
        },
      },
    },
    getBillingError: {
      on: {
        REFETCH_BILLING: {
          target: "loadingBilling",
        },
      },
    },
    billingFormIdle: {
      always: [
        {
          cond: "creatingForm",
          target: "#firstStep",
        },
        {
          target: "loadingBillingDetail",
        },
      ],
    },
    loadingBillingDetail: {
      on: {
        FETCHING_BILLING_DETAIL_SUCCES: {
          target: "#firstStep",
        },
        FETCHING_BILLING_DETAIL_ERROR: {
          target: "getBillingDetailError",
        },
      },
    },
    getBillingDetailError: {
      on: {
        REFTECH_BILLING_DETAIL: {
          target: "loadingBillingDetail",
        },
      },
    },
    billingFormReady: {
      initial: "firstStep",
      states: {
        firstStep: {
          id: "firstStep",
          on: {
            NEXT_STEP: {
              target: "secondStep",
            },
          },
        },
        secondStep: {
          id: "secondStep",
          on: {
            PREV_STEP: {
              target: "firstStep",
            },
            SUBMIT_BILLING: {
              target: "#submitBilling",
            },
          },
        },
      },
    },
    submitBilling: {
      id: "submitBilling",
      on: {
        SUBMIT_BILLING_SUCCES: {
          target: "submitBillingOK",
        },
        SUBMIT_BILLING_ERROR: {
          target: "submitBillingError",
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
        RETRY_SUBMIT_BILLING: {
          target: "submitBilling",
        },
        BACK_TO_SECOND_STEP_FORM: {
          target: "#secondStep",
        },
      },
    },
  },
});
