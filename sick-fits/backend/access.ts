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
  canManageProducts({ session }) {
    // 1. Do they have the permission of canManageProducts
    // 2. If not, do they own this item
  },
};
