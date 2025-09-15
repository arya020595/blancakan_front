/**
 * Roles Hooks
 * Custom hooks for role-related operations
 * Follows SOLID principles with proper separation of concerns
 */

import { rolesApiService } from "@/lib/api/services/roles-service";
import type {
  ApiError,
  CreateRoleRequest,
  PaginationMeta,
  Role,
  RolesQueryParams,
  UpdateRoleRequest,
} from "@/lib/api/types";
import { createLogger } from "@/lib/utils/logger";
import { useCallback, useState } from "react";

const logger = createLogger("ROLES HOOKS");

// Hook for fetching roles list with optimistic updates
export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchRoles = useCallback(async (params: RolesQueryParams = {}) => {
    try {
      logger.info("Starting roles fetch", params);
      setIsLoading(true);
      setError(null);

      const response = await rolesApiService.getRoles(params);

      logger.info("Roles fetch successful", {
        count: response.data.length,
        total: response.meta.total_count,
      });

      setRoles(response.data);
      setMeta(response.meta);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      logger.error("Roles fetch failed", apiError);
      setError(apiError);
      setRoles([]);
      setMeta(null);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshRoles = useCallback(
    (params?: RolesQueryParams) => {
      return fetchRoles(params);
    },
    [fetchRoles]
  );

  return {
    roles,
    meta,
    isLoading,
    error,
    fetchRoles,
    refreshRoles,
    setRoles,
    setMeta,
  };
};

// Hook for creating a new role with optimistic updates
export const useCreateRole = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createRole = useCallback(
    async (roleData: CreateRoleRequest, onSuccess?: (role: Role) => void) => {
      try {
        logger.info("Starting role creation", { name: roleData.role.name });
        setIsLoading(true);
        setError(null);

        const newRole = await rolesApiService.createRole(roleData);

        logger.info("Role creation successful", {
          id: newRole._id,
          name: newRole.name,
        });

        onSuccess?.(newRole);
        return newRole;
      } catch (err) {
        const apiError = err as ApiError;
        logger.error("Role creation failed", { roleData, error: apiError });
        setError(apiError);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    createRole,
    isLoading,
    error,
    setError,
  };
};

// Hook for updating a role with optimistic updates
export const useUpdateRole = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const updateRole = useCallback(
    async (
      id: string,
      roleData: UpdateRoleRequest,
      onSuccess?: (role: Role) => void
    ) => {
      try {
        logger.info("Starting role update", { id, name: roleData.role.name });
        setIsLoading(true);
        setError(null);

        const updatedRole = await rolesApiService.updateRole(id, roleData);

        logger.info("Role update successful", {
          id: updatedRole._id,
          name: updatedRole.name,
        });

        onSuccess?.(updatedRole);
        return updatedRole;
      } catch (err) {
        const apiError = err as ApiError;
        logger.error("Role update failed", { id, roleData, error: apiError });
        setError(apiError);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    updateRole,
    isLoading,
    error,
    setError,
  };
};

// Hook for deleting a role with optimistic updates
export const useDeleteRole = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const deleteRole = useCallback(async (id: string, onSuccess?: () => void) => {
    try {
      logger.info("Starting role deletion", { id });
      setIsLoading(true);
      setError(null);

      await rolesApiService.deleteRole(id);

      logger.info("Role deletion successful", { id });

      onSuccess?.();
      return id;
    } catch (err) {
      const apiError = err as ApiError;
      logger.error("Role deletion failed", { id, error: apiError });
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    deleteRole,
    isLoading,
    error,
    setError,
  };
};

// Hook for fetching a single role by ID
export const useRole = () => {
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchRole = useCallback(async (id: string) => {
    try {
      logger.info("Starting role fetch by ID", { id });
      setIsLoading(true);
      setError(null);

      const roleData = await rolesApiService.getRole(id);

      logger.info("Role fetch by ID successful", {
        id: roleData._id,
        name: roleData.name,
      });

      setRole(roleData);
      return roleData;
    } catch (err) {
      const apiError = err as ApiError;
      logger.error("Role fetch by ID failed", { id, error: apiError });
      setError(apiError);
      setRole(null);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    role,
    isLoading,
    error,
    fetchRole,
    setRole,
    setError,
  };
};

// Optimistic update hook for better UX
export const useOptimisticRoles = () => {
  const [optimisticUpdates, setOptimisticUpdates] = useState<
    Map<string, "creating" | "updating" | "deleting">
  >(new Map());

  const addOptimisticUpdate = useCallback(
    (id: string, action: "creating" | "updating" | "deleting") => {
      setOptimisticUpdates((prev) => new Map(prev.set(id, action)));
    },
    []
  );

  const removeOptimisticUpdate = useCallback((id: string) => {
    setOptimisticUpdates((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const clearOptimisticUpdates = useCallback(() => {
    setOptimisticUpdates(new Map());
  }, []);

  const getOptimisticStatus = useCallback(
    (id: string) => {
      return optimisticUpdates.get(id);
    },
    [optimisticUpdates]
  );

  return {
    optimisticUpdates,
    addOptimisticUpdate,
    removeOptimisticUpdate,
    clearOptimisticUpdates,
    getOptimisticStatus,
  };
};
