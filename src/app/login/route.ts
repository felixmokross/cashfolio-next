import { authorize } from "@/auth.server";

export async function GET(request: Request) {
  return authorize(request);
}
