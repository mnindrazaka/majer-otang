import { Configuration, MembersApi } from "../__generated__/api";

export * from "../__generated__/api";

const configuration = new Configuration({
  basePath: "http://localhost:5000"
});

export const membersApi = new MembersApi(configuration);
