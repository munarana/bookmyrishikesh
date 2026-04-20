import { POST as registerPost } from "@/app/api/auth/register/route";

export async function POST(req: Request) {
  return registerPost(req);
}
