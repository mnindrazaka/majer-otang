import {
  Configuration,
  MembersApi,
  BillingsApi,
  PaymentsApi,
} from "../__generated__/api";

export * from "../__generated__/api";

const configuration = new Configuration({
  basePath: process.env.NEXT_PUBLIC_API_URL,
});

export const membersApi = new MembersApi(configuration);
export const paymentsApi = new PaymentsApi(configuration);
export const billingsApi = new BillingsApi(configuration);
