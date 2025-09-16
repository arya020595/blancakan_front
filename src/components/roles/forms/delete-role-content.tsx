"use client";

export interface DeleteRoleContentProps {
  roleName: string;
}

/**
 * DeleteRoleContent: body text for delete confirmation (no modal UI or buttons).
 */
export function DeleteRoleContent({ roleName }: DeleteRoleContentProps) {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-500">
        Are you sure you want to delete the role
        <span className="font-medium text-gray-900">
          {" "}
          &quot;{roleName}&quot;
        </span>
        ? This action cannot be undone.
      </p>
    </div>
  );
}

export default DeleteRoleContent;
