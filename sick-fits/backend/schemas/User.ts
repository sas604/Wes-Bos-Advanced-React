import { list } from '@keystone-next/keystone/schema';
import { text, password, relationship } from '@keystone-next/fields';
import { permissions, rules } from '../access';

export const User = list({
  access: {
    create: () => true,
    read: rules.canManageUsers,
    update: rules.canManageUsers,
    delete: permissions.canManageUsers,
  },

  ui: {
    hideCreate: (args) => !permissions.canManageUsers(args),
    hideDelete: (args) => !permissions.canManageUsers(args),
  },
  fields: {
    name: text({ isRequired: true }),
    email: text({ isRequired: true, isUnique: true }),
    password: password(),
    cart: relationship({
      ref: 'CartItem.user',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    orders: relationship({ ref: 'Order.user', many: true }),
    role: relationship({
      ref: 'Role.assignedTo',
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,
      },
      ui: {
        createView: {
          fieldMode: (args) =>
            permissions.canManageUsers(args) ? 'edit' : 'hidden',
        },
        itemView: {
          fieldMode: (args) =>
            permissions.canManageUsers(args) ? 'edit' : 'read',
        },
        // listView: {
        //   fieldMode: ({ session }) =>
        //     permissions.canManageUsers ? 'read' : 'hidden',
        // },
      },
    }),
    products: relationship({ ref: 'Product.user', many: true }),
  },
});
