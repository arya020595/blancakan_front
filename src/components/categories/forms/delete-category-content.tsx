"use client";

export interface DeleteCategoryContentProps {
  categoryName: string;
}

/**
 * DeleteCategoryContent: body text for delete confirmation (no modal UI or buttons).
 */
export function DeleteCategoryContent({ categoryName }: DeleteCategoryContentProps) {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-500">
        Are you sure you want to delete the category
        <span className="font-medium text-gray-900">
          {" "}
          &quot;{categoryName}&quot;
        </span>
        ? This action cannot be undone.
      </p>
    </div>
  );
}

export default DeleteCategoryContent;