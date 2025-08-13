import { setCredentials } from "../store/slices/userSlice";
import type { IAuthResponse } from "../types/auth";

export const handleAuthQueryStarted = async <TArg>(
  _arg: TArg,
  {
    dispatch,
    queryFulfilled,
  }: {
    dispatch: any;
    queryFulfilled: Promise<{ data: IAuthResponse }>;
  }
) => {
  try {
    const { data } = await queryFulfilled;
    if (data?.accessToken) {
      dispatch(setCredentials({ token: data.accessToken }));
    }
  } catch (err) {
    console.error('[handleAuthQueryStarted error]', err);
  }
};
