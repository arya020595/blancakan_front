"use client";

export interface DeleteEventTypeContentProps {
  eventTypeName: string;
}

/**
 * DeleteEventTypeContent: Confirmation content for delete modal
 */
export function DeleteEventTypeContent({ eventTypeName }: DeleteEventTypeContentProps) {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-500">
        Are you sure you want to delete the event type{" "}
        <span className="font-medium text-gray-900">{eventTypeName}</span>?
        This action cannot be undone.
      </p>
    </div>
  );
}

export default DeleteEventTypeContent;