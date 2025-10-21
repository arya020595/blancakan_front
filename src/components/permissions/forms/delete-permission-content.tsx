interface DeletePermissionContentProps {
  permissionAction: string;
  permissionSubject: string;
}

export function DeletePermissionContent({
  permissionAction,
  permissionSubject,
}: DeletePermissionContentProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Are you sure you want to delete this permission?
      </p>
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-700">Action:</span>
            <span className="ml-2 text-sm text-gray-900">{permissionAction}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">Subject:</span>
            <span className="ml-2 text-sm text-gray-900">{permissionSubject}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-red-600 font-medium">
        This action cannot be undone.
      </p>
    </div>
  );
}
