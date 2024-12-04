import { AbilityBuilder, Ability } from '@casl/ability';

export const defineAbilitiesFor = () => {
  const role = localStorage.getItem('userRole');

  const { can, cannot, build } = new AbilityBuilder(Ability);

  switch (role) {
    case 'Super Admin':
      can('create', 'Admins'); 
      can('update', 'Profile'); 
      break;
    case 'Restaurant Register':
      can('create', 'User');
      can('create', 'Role');
      can('update', 'Profile');
      can('view', 'Reports');
      break;
    case 'Kitchen Manager':
      can('view', 'Menu');
      can('create', 'Menu');
      can('update', 'OrderStatus');
      can('update', 'Profile');
      break;
    case 'Branch Manager':
      can('read', 'Menu');
      can('read', 'Orders');
      can('update', 'Profile');
      break;
    case 'Cashier':
      can('view', 'Orders');
      break;
    case 'Customer':
      can('create', 'Order');
      can('read', 'Order');
      break;
    default:
      cannot('manage', 'all'); 
      break;
  }

  return build();
};
