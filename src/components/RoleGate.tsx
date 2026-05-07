/**
 * RoleGate — conditionally renders children based on the calling worker's role.
 *
 * Usage (server component):
 *   <RoleGate roles={["manager", "owner"]}>
 *     <DangerButton />
 *   </RoleGate>
 *
 *   <RoleGate permission="export_cqc_pack" fallback={<UpsellCard/>}>
 *     <ExportButton />
 *   </RoleGate>
 *
 * The gate reads the current session (cached per request) so embedding it
 * many times in a page is cheap.
 *
 * RoleGate enforces visibility ONLY. The server-side action behind any gated
 * UI must independently re-check permission — never trust the client.
 */
import type { ReactNode } from "react";
import { getCurrentSession, hasAnyRole, type Role } from "@/lib/auth";
import { can, type Permission } from "@/lib/rbac";

type Props = {
  children: ReactNode;
  roles?: Role[];
  permission?: Permission;
  /** Renders when the gate fails. Defaults to nothing. */
  fallback?: ReactNode;
};

export async function RoleGate({ children, roles, permission, fallback = null }: Props) {
  const session = await getCurrentSession();

  if (!session.signedIn || !session.activeCommunity) {
    return <>{fallback}</>;
  }

  const activeRole = session.activeCommunity.role;
  const roleOk = !roles || roles.length === 0 ? true : roles.includes(activeRole);
  const permOk = !permission ? true : can(activeRole, permission);

  if (roleOk && permOk) return <>{children}</>;
  return <>{fallback}</>;
}
