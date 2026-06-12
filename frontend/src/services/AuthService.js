import {refreshAPI} from "@/api/axios";

export async function refreshSession() {
  const res = await refreshAPI.post(
    "/auth/tokens/refresh",
    {}
  );

  return res.data;
}
