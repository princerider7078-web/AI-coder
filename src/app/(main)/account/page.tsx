import { redirect } from "next/navigation";

/** /account → redirect to /account/dashboard */
export default function AccountRedirect() {
  redirect("/account/dashboard");
}
