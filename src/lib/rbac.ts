/**
 * Role-based access control primitives for Kapture Care.
 *
 * The role set is the single source of truth — both DB (roles_enum) and app
 * (this file) reference the same string IDs.
 */
import type { Role } from "./auth";

export const ROLE_LABELS: Record<Role, string> = {
  admin:         "System Admin",
  owner:         "Owner / Director",
  manager:       "Registered Manager",
  clinical_lead: "Clinical Lead",
  senior_carer:  "Senior Carer",
  nurse:         "Nurse",
  carer:         "Carer",
  activities:    "Activities Coordinator",
  cook:          "Kitchen Lead",
  maintenance:   "Maintenance",
  resident:      "Resident",
  family:        "Family",
  inspector:     "Inspector",
};

/** Lower rank = more senior. */
export const ROLE_RANK: Record<Role, number> = {
  admin: 0,
  owner: 10,
  manager: 20,
  clinical_lead: 25,
  senior_carer: 30,
  nurse: 35,
  carer: 40,
  activities: 45,
  cook: 45,
  maintenance: 45,
  resident: 70,
  family: 60,
  inspector: 50,
};

export function isAtLeast(role: Role, minimum: Role): boolean {
  return ROLE_RANK[role] <= ROLE_RANK[minimum];
}

/**
 * Permission flags — surface-level capabilities each role gets. Fine-grained
 * field-level control is enforced server-side via RLS + Postgres function
 * `field_permissions` (added in a later migration). This map is the UI-side
 * coarse-grained gate used by the RoleGate component and nav.
 */
export type Permission =
  | "view_residents"
  | "create_care_note"
  | "edit_care_plan"
  | "void_care_note"
  | "approve_handover"
  | "view_audit_log"
  | "export_cqc_pack"
  | "manage_workers"
  | "manage_modules"
  | "manage_billing";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "view_residents", "create_care_note", "edit_care_plan", "void_care_note",
    "approve_handover", "view_audit_log", "export_cqc_pack",
    "manage_workers", "manage_modules", "manage_billing",
  ],
  owner: [
    "view_residents", "create_care_note", "edit_care_plan", "void_care_note",
    "approve_handover", "view_audit_log", "export_cqc_pack",
    "manage_workers", "manage_modules", "manage_billing",
  ],
  manager: [
    "view_residents", "create_care_note", "edit_care_plan", "void_care_note",
    "approve_handover", "view_audit_log", "export_cqc_pack",
    "manage_workers", "manage_modules",
  ],
  clinical_lead: [
    "view_residents", "create_care_note", "edit_care_plan",
    "approve_handover", "view_audit_log", "export_cqc_pack",
  ],
  senior_carer: [
    "view_residents", "create_care_note", "approve_handover", "void_care_note",
  ],
  nurse: [
    "view_residents", "create_care_note", "edit_care_plan",
  ],
  carer: [
    "view_residents", "create_care_note",
  ],
  activities: [
    "view_residents", "create_care_note",
  ],
  cook: [
    "view_residents",
  ],
  maintenance: [],
  resident: [],
  inspector: [
    "view_residents", "view_audit_log", "export_cqc_pack",
  ],
  family: [
    "view_residents",
  ],
};

export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
