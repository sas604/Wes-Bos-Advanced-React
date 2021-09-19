// At it's simplest, the access control returns yes or no value depending on the user session

import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs): boolean {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

export const permissions = {
  ...generatedPermissions,
};

// Role based functions
// Rules can return a boolean, or a filter wich limits whitch products they can CRUD

export const rules = {
  canManageProducts({ session }): ListAccessArgs {
    // 1. Do they have the permission of canManageProducts
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. If not, do they own this item
    return { user: { id: session.itemId } };
  },
  canReadProducts({ session }): ListAccessArgs {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageProducts({ session })) {
      return true; // They can read everything
    }
    // They should only see available products ( based on the status field )

    return { status: 'AVALIBLE' };
  },
  canOrder({ session }): ListAccessArgs {
    // 1. Do they have the permission of can
    if (!isSignedIn({ session })) {
      return false;
    }

    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. If not, do they own this item
    return { user: { id: session.itemId } };
  },
  canManageItems({ session }): ListAccessArgs {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have the permission of canManageProducts
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. If not, do they own this item
    return { order: { user: { id: session.itemId } } };
  },
  canManageUsers({ session }): ListAccessArgs {
    // 1. Do they have the permission of can
    if (!isSignedIn({ session })) {
      return false;
    }

    if (permissions.canManageUsers({ session })) {
      return true;
    }
    // 2. If not, do they own this item
    return { id: session.itemId };
  },
};
