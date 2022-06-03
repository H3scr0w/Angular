export class SubMenu {
  id: number;
  label: string;
  icon: string;
  url: string;
  state: boolean;
}
export class Menu {
  label: string;
  items: SubMenu[];
}

export class ConstantMenu {
  static readonly WEBSITE_MENU: Menu = {
    label: 'Website',
    items: [
      {
        id: 0,
        label: 'WSIP',
        icon: 'fas fa-database fa-lg',
        url: '/website/wsip-configurations',
        state: true
      },
      {
        id: 1,
        label: 'Security',
        icon: 'fas fa-shield-alt fa-lg',
        url: '/website/security-reports',
        state: false
      }
      /* ,{
        id: 1,
        label: 'Infractructure Configuration',
        icon: 'fas fa-building fa-lg',
        url: '/website/infrastructure-configurations',
        state: false
      }*/
    ]
  };

  static readonly DEPLOYMENT_MENU: Menu = {
    label: 'Deployment',
    items: [
      { id: 0, label: 'New request', icon: 'fas fa-plus-square fa-lg', url: '/deployment/new-request', state: true },
      {
        id: 1,
        label: 'Pending deployment',
        icon: 'fas fa-stopwatch fa-lg',
        url: '/deployment/pending-deployment',
        state: false
      },
      {
        id: 2,
        label: 'All deployment',
        icon: 'fas fa-list-alt fa-lg',
        url: '/deployment/all-deployment',
        state: false
      }
    ]
  };

  static readonly ADMIN_MENU: Menu = {
    label: 'Admin',
    items: [
      { id: 0, label: 'Users', icon: 'fas fa-user-lock fa-lg', url: '/admin/admin-user', state: true },
      {
        id: 1,
        label: 'WSIP',
        icon: 'fas fa-database fa-lg',
        url: '/admin/admin-wsip',
        state: false
      },
      { id: 2, label: 'Tools', icon: 'fas fa-toolbox fa-lg', url: '/admin/admin-tools', state: false }
    ]
  };
}
