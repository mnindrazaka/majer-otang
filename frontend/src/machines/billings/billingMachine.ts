import { createMachine, assign } from "xstate";
import { match } from "ts-pattern";
import {
  Member,
  Billing,
  BillingDetail,
  BillingMember,
} from "../../utils/fetcher";

type BillingForm = {
  title: string;
  total: number;
  chargedMember: string;
  isBillEqual: boolean;
  members: BillingMember[];
};

enum FormMode {
  Create = "CREATE",
  Edit = "EDIT",
}

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

export namespace State {
  export namespace GetBillingOK {
    export type t = {
      value: "getBillingOK";
      context: Context & {
        billingError: null;
        membersError: null;
        billingDetail: undefined;
        billingDetailError: null;
        billingForm: undefined;
        submitBillingError: null;
      };
    };

    export const make = (context: Context, billings: Billing[]): t => ({
      value: "getBillingOK",
      context: {
        ...context,
        billings,
        billingError: null,
        membersError: null,
        billingDetail: undefined,
        billingDetailError: null,
        billingForm: undefined,
        submitBillingError: null,
      },
    });
  }

  export type t =
    | {
        value: "idle";
        context: Context & {
          billingError: null;
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
          billingError: null;
          membersError: null;
          billingDetail: undefined;
          billingDetailError: null;
          billingForm: undefined;
          submitBillingError: null;
        };
      }
    | GetBillingOK.t
    | {
        value: "getBillingError";
        context: Context & {
          billingError: string;
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
          billingError: null;
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
          billingError: null;
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
          billingError: null;
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
          billingError: null;
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
          billingError: null;
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
          billingError: null;
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
          billingError: null;
          membersError: null;
          billingDetail: BillingDetail;
          billingDetailError: null;
          billingForm: BillingForm;
          submitBillingError: null;
        };
      }
    | {
        value: { billingFormReady: "firstStep" };
        context: Context & {
          billingError: null;
          membersError: null;
          billingDetail: BillingDetail;
          billingDetailError: null;
          billingForm: BillingForm;
          submitBillingError: null;
        };
      }
    | {
        value: { billingFormReady: "secondStep" };
        context: Context & {
          billingError: null;
          membersError: null;
          billingDetail: BillingDetail;
          billingDetailError: null;
          billingForm: BillingForm;
          submitBillingError: null;
        };
      }
    | {
        value: "submitBilling";
        context: Context & {
          billingError: null;
          membersError: null;
          billingDetail: BillingDetail;
          billingDetailError: null;
          billingForm: BillingForm;
          submitBillingError: null;
        };
      }
    | {
        value: "submitBillingOK";
        context: Context & {
          billingError: null;
          membersError: null;
          billingDetail: BillingDetail;
          billingDetailError: null;
          billingForm: BillingForm;
          submitBillingError: null;
        };
      }
    | {
        value: "submitBillingError";
        context: Context & {
          billingError: null;
          membersError: null;
          billingDetail: BillingDetail;
          billingDetailError: null;
          billingForm: BillingForm;
          submitBillingError: string;
        };
      };
}

type Event =
  | { type: "FETCH_BILLING" }
  | { type: "FETCH_BILLING_SUCCES"; billingsData: Billing[] }
  | { type: "FETCH_BILLING_ERROR"; billingsErrorMessage: string }
  | { type: "ACTIVATE_BILLING_FORM"; formMode: FormMode }
  | { type: "REFETCH_BILLING" }
  | { type: "FETCH_MEMBER_SUCCESS"; membersData: Member[] }
  | { type: "FETCH_MEMBER_ERROR"; membersErrorMessage: string }
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
  | { type: "SUBMIT_BILLING_ERROR"; submitBillingErrorMessage: string }
  | { type: "BACK_TO_BILLING_SCREEN" }
  | { type: "BACK_TO_SECOND_STEP_FORM" }
  | { type: "REFETCH_SUBMIT_BILLING" };

export const billingMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCMCWAbdqB2UB0qE6YAxAGICiAKgMIASA+gEICSAMmywHIDiioABwD2sVABdUQ7PxAAPRAEYAzAFY8KgAxaNKgEwB2AGwLdqlQBoQAT0UAWXQrwAOJUoOql+3YcP6Avn6WaJg4+OhCAIYQoUwYWLjk1PTM7Jy8DADKAKo0NBQZMsKiElIy8giGqnhehiqahrpOXg6WNggKtk66eACcfT2umk5OekoBQXGheOFRMZMJlLSMrBzcPAwUAEqbAPKbhSLiktJIcoiVajV1Gg1Nui3Wiko9av0v+rY9Jm664yDB8XwMDEsRCuB2AGkSABBGhUFgANWhVAoKVW6TIewAsgdiscyog9K1FBoDL1+voOhoFNTTH8AVNgaDARQAE6soSskibCiLZIrNJ8U5FI6lU7lC7VbzXW7NBTE9pKWz6cl9ZW2BROSq6FT0+b4Bm4MicgC2LCIYGmkWiuCxYBNyDArNgiSWDCxFCxTC2mRyeQyBWFhxKJ1A5V0PVseB1+icmv0qg1TQVTmVeE+fQ+BmGPVjerBBv1xtZZotVtmtvtjudruSHq9Pq2u32QbxYrDiAjUZjcaaifjCqMGnTby6xgM+l1gX++rwhqgxdLxDwwLtDqdsDZHK5PL5jHr3s2gcEwfx4sQSkMPWcqi+-Uat1sg5MI76w01Wrz0-nc6LpvNy5MvqAAiYBiBEGA0FI0QhiQuKiqGZwIC4KoqM8Oi+LY9iNE4KY6KqPS1AotQqAMU4TAWv4FouAGWkBBageBGDARE4G1ssqRrAwwHUNC7C+rk+TwSGBLIZ46joSomHYcMz5OARThfMquZKAo+aAlRgI0WW9GAoxEHoCxbF7migrcbx-FNnswlnh2CBdtGKixvG-bJo8CC2Eq6jaCYCiUjo+j+N+s7ztpgFgcyoT6cxrERFunLcrySQcei6w8VQfFsDZ7ZIa4w5dHGEb6IRyqkQqShat52i6BoPSpioXTkTOlGhaamxgFEVh4AAZqgzpiBkYhgAIJBcBQAAaVCZCiAAK2WIeUyi6FGlJ9l4imuFqz7XhmLz3AoKg0lq6lTK1JbtZ1PV9bAA1DSNWQzcByKopimw4q2CGiQoxGGHg8adIphhxjoSgKuOeCuHlUnKFehEnbgmmhIuF0QF1sBgAAxtBg3DSQM08gi00UHNH0ieeirLc4pGXs8QM0mhYOUq+kYOPYmhfPDhbUW1HWo3g6NY9gEA4-dj3PQwr3vSebYLXYKhRpGehfBcbiEWDSjDhGmYNcYCZNT+Z0mijaOY9jd0kNkTBYiwU0Cms81fYYnTpkYaF9FJUmg+5lS-VrLwa99pKeJziNGjznUkDQ0JcHkbAS6kEvYg75PEc7yq1M8Ly1JUg7O37aF1IVfkh7AACuyAmuIkUJJb1u25x6TZIJx4gCKZN2QouYqh8fSGBosbDLVuhg5T+fLZUPQxiX5eVyC+oW1kVs26ZXFWS20ufeT9xqCMB0XMVNWUgqPTDto1JKgHbhO9PFdV-qkIkEwsIQgwVA7Cvjc0DyFBcMndmmN0J2qZlqai7gMBUyg0I3ivkOYiBh9azjLrfOeBZ4pcifjQF+b9MgUBoDsLgwEiYzUTm9P+SFUyoUktJe4slvb6GHG8Yq-c0IJkMDfWe1coBoMSiZWuy87a8DIeUChEkT5SQ+DJXC7llryV2qmDUHQ0K2ACNObAQgIBwBkD+QgxAhGEmHu5DoxEIauAMJqBqmhSQhxmDaKAnC9EeTjHgXWxE6peBeLVfQEDbD92ZrYBoxV-G5hDrpUIkIHFamvPcWoGpDryz8lItoxFXDM1JHGKk19gqUVCbgNBESGoEUnAk0wXjDE+O6C4NwHwmi3EaCHQ2tFyy2LXNWeApNbJIRpCqHs3hXFZ3sM+buu1WGdwqr8LJGkGk6TAi0jceT2k5XKE5QBxUgb+P2h0L2bRKS-R8Hs+WzCvhBQopMv8JZGk5KgNFdAUEhabw3u3JCyznGrNTA0BwmyUzGGZvQ6GDQej1LOUuOiEUQJgQMkZCIETSltGeI4Sc2hJzLWVMRQF3NznTJQXpcFMVwLzIeR0pZXgXmETeRszy5UT7OL2R8NwNJ7BODRVpf8FoHE53cqpKMcitRAzcFJJlSNw5816v1EWDjvqKWjFePQh0lSfC2YgehUZIaNGScoTuAKJmnSBcbfmpshZioWbLdo-i1DUg8X0DCXRBz3GjP0Q6TQyJoQFWHc6vM2gEsWYoDo3R-o5jpiDBUByTGqwcC4cR7C74FnFZUv6PiGpNB5TcGF5xNTVHtU7G4pIBiRqxWEiEbKU2KmdiqhMGo9b+NzZw-FrdTxeo8gYtoy1hy7RPvcVaGhPKcxjRA+SZ9+1nzGCooAA */
  createMachine<Context, Event, State.t>({
    context: {
      billings: [],
      billingError: null,
      formMode: FormMode.Create,
      members: [],
      membersError: null,
      billingDetail: undefined,
      billingDetailError: null,
      billingForm: undefined,
      submitBillingError: null,
    },
    schema: { context: {} as Context, events: {} as Event },
    id: "billing",
    initial: "idle",
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
            actions: assign(
              (context, event) =>
                State.GetBillingOK.make(context, event.billingsData).context
            ),
            target: "getBillingOK",
          },
          FETCH_BILLING_ERROR: {
            actions: "updateContext",
            target: "getBillingError",
          },
        },
      },
      getBillingOK: {
        on: {
          ACTIVATE_BILLING_FORM: {
            actions: "updateContext",
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
        initial: "loadingMembers",
        states: {
          loadingMembers: {
            on: {
              FETCH_MEMBER_SUCCESS: {
                actions: "updateContext",
                target: "getBillingDetailCondition",
              },
              FETCH_MEMBER_ERROR: {
                actions: "updateContext",
                target: "getMembersError",
              },
            },
          },
          getMembersError: {
            on: {
              REFETCH_MEMBERS: {
                target: "loadingMembers",
              },
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
                actions: "updateContext",
                target: "#billing.billingFormReady",
              },
              FETCH_BILLING_DETAIL_ERROR: {
                actions: "updateContext",
                target: "getBillingDetailDataError",
              },
            },
          },
          getBillingDetailDataError: {
            on: {
              REFETCH_BILLING_DETAIL: {
                target: "getBillingDetailData",
              },
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
              PREV_STEP: {
                target: "firstStep",
              },
              UPDATE_FORM: {
                actions: "updateContext",
              },
              SUBMIT_BILLING: {
                target: "#billing.submitBilling",
              },
            },
          },
        },
        on: {
          CANCEL_FILL_FORM: {
            target: "getBillingOK",
          },
        },
      },
      submitBilling: {
        on: {
          SUBMIT_BILLING_SUCCES: {
            target: "submitBillingOK",
          },
          SUBMIT_BILLING_ERROR: {
            actions: "updateContext",
            target: "submitBillingError",
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
          BACK_TO_SECOND_STEP_FORM: {
            target: "#billing.billingFormReady.secondStep",
          },
          REFETCH_SUBMIT_BILLING: {
            target: "submitBilling",
          },
        },
      },
    },
  }).withConfig({
    actions: {
      updateContext: assign((ctx, event, meta) =>
        match(event)
          .with({ type: "FETCH_BILLING" }, () => ctx)
          .with({ type: "REFETCH_BILLING" }, () => ({
            ...ctx,
            billingError: null,
            billings: [],
          }))
          .with({ type: "REFETCH_MEMBERS" }, () => ({
            ...ctx,
            membersError: null,
            members: [],
          }))
          .with({ type: "REFETCH_BILLING_DETAIL" }, () => ({
            ...ctx,
            billingDetailError: null,
            billingDetail: undefined,
          }))
          .with({ type: "REFETCH_SUBMIT_BILLING" }, () => ({
            ...ctx,
            submitBillingError: null,
          }))
          .with({ type: "NEXT_STEP" }, () => ctx)
          .with({ type: "PREV_STEP" }, () => ctx)
          .with({ type: "SUBMIT_BILLING" }, () => ctx)
          .with({ type: "SUBMIT_BILLING_SUCCES" }, () => ctx)
          .with({ type: "BACK_TO_SECOND_STEP_FORM" }, () => ctx)
          .with({ type: "CANCEL_FILL_FORM" }, () => ctx)
          .with({ type: "BACK_TO_BILLING_SCREEN" }, () => ({
            ...ctx,
            billings: [],
            billingError: null,
            formMode: FormMode.Create,
            members: [],
            membersError: null,
            billingDetail: undefined,
            billingDetailError: null,
            billingForm: undefined,
            submitBillingError: null,
          }))
          .with({ type: "ACTIVATE_BILLING_FORM" }, (event) => ({
            ...ctx,
            formMode: event.formMode,
            billingForm: {
              title: "",
              total: 0,
              chargedMember: "",
              isBillEqual: true,
              members: [],
            },
          }))
          .with({ type: "FETCH_BILLING_SUCCES" }, (event) => ({
            ...ctx,
            billings: event.billingsData,
          }))
          .with({ type: "FETCH_BILLING_ERROR" }, (event) => ({
            ...ctx,
            billingError: event.billingsErrorMessage,
          }))
          .with({ type: "FETCH_BILLING_DETAIL_SUCCES" }, (event) => ({
            ...ctx,
            billingDetail: event.billingDetailData,
            billingForm: {
              title: event.billingDetailData.title,
              total: event.billingDetailData.bill_amount,
              chargedMember: event.billingDetailData.charged_member_id,
              isBillEqual: event.billingDetailData.is_bill_equally,
              members: event.billingDetailData.members,
            },
          }))
          .with({ type: "FETCH_BILLING_DETAIL_ERROR" }, (event) => ({
            ...ctx,
            billingDetailError: event.billingDetailErrorMessage,
          }))
          .with({ type: "FETCH_MEMBER_SUCCESS" }, (event) => ({
            ...ctx,
            members: event.membersData,
          }))
          .with({ type: "FETCH_MEMBER_ERROR" }, (event) => ({
            ...ctx,
            membersError: event.membersErrorMessage,
          }))
          .with({ type: "UPDATE_FORM" }, (event) => ({
            ...ctx,
            billingForm: event.billingForm,
          }))
          .with({ type: "SUBMIT_BILLING_ERROR" }, (event) => ({
            ...ctx,
            submitBillingError: event.submitBillingErrorMessage,
          }))
          .exhaustive()
      ),
    },
    guards: {
      isCreatingForm: (ctx) => ctx.formMode === "CREATE",
    },
  });
