import {
  Configuration,
  MembersApi,
  BillingsApi,
  PaymentsApi
} from "../__generated__/api";

export * from "../__generated__/api";

const configuration = new Configuration({
  basePath: "http://localhost:4000"
});

export const membersApi = new MembersApi(configuration);
export const paymentsApi = new PaymentsApi(configuration);
export const billingsApi = new BillingsApi(configuration);
