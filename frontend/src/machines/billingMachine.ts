import { createMachine, assign } from "xstate";

type Billing = {
  id: string;
  title: string;
  amount: number;
};

interface Context {
  billings: Billing[];
  isEditingForm: boolean;
  isCreatingForm: boolean;
}

const billingMachine = createMachine<Context>({
  id: "billing",
  initial: "idle",
  context: {
    billings: [],
    isCreatingForm: false,
    isEditingForm: false,
  },
  states: {
    idle: {
      on: {
        FETCHINGBILLINGS: {
          target: "gettingBilling",
        },
      },
    },
    gettingBilling: {
      on: {
        FETCHINGBILLINGSSUCCES: {
          target: "gettingBillingOK",
        },
        FETCHINGBILLINGSERROR: {
          target: "gettingBillingError",
        },
      },
    },
    gettingBillingOK: {
      on: {
        ACTIVATEBILLINGFORM: {
          target: "billingFormIdle",
        },
      },
    },
    gettingBillingError: {
      on: {
        REFETCHINGBILLINGS: {
          target: "gettingBilling",
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
          target: "gettingBillingDetail",
        },
      ],
    },
    gettingBillingDetail: {
      on: {
        FETCHINGBILLINGDETAILSUCCES: {
          target: "#firstStep",
        },
        FETCHINGBILLINGDETAILERROR: {
          target: "gettingBillingDetailError",
        },
      },
    },
    gettingBillingDetailError: {
      on: {
        REFTECHBILLINGDETAIL: {
          target: "gettingBillingDetail",
        },
      },
    },
    billingFormReady: {
      initial: "firstStep",
      states: {
        firstStep: {
          id: "firstStep",
          on: {
            NEXTSTEP: {
              target: "secondStep",
            },
          },
        },
        secondStep: {
          id: "secondStep",
          on: {
            PREVSTEP: {
              target: "firstStep",
            },
            SUBMITBILLING: {
              target: "#submittingBilling",
            },
          },
        },
      },
    },
    submittingBilling: {
      id: "submittingBilling",
      on: {
        SUBMITBILLINGSUCCES: {
          target: "submittingBillingOK",
        },
        SUBMITBILLINGERROR: {
          target: "submittingBillingError",
        },
      },
    },
    submittingBillingOK: {
      type: "final",
      on: {
        BACKTOBILLINGSSCREEN: {
          target: "gettingBillingOK",
        },
      },
    },
    submittingBillingError: {
      on: {
        RETRYSUBMITBILLING: {
          target: "submittingBilling",
        },
        BACKTOSECONDSTEPFORM: {
          target: "#secondStep",
        },
      },
    },
  },
});
