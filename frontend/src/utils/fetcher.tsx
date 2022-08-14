import { Configuration, MembersApi, BillingsApi } from "../__generated__/api";

export * from "../__generated__/api";

const configuration = new Configuration({
  basePath: "http://localhost:4000",
});

export const membersApi = new MembersApi(configuration);
export const billingsApi = new BillingsApi(configuration);
