import { Configuration, MembersApi } from "../__generated__/api";

export * from "../__generated__/api";

const configuration = new Configuration({
  basePath: "https://api.themoviedb.org/3",
});

export const membersApi = new MembersApi(configuration);
