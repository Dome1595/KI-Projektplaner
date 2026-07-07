// assets
import { TeamOutlined, SettingOutlined } from '@ant-design/icons';

// icons
const icons = {
  TeamOutlined,
  SettingOutlined
};

// ==============================|| MENU ITEMS - VERWALTUNG ||============================== //

const verwaltung = {
  id: 'group-verwaltung',
  title: 'Verwaltung',
  type: 'group',
  children: [
    {
      id: 'kunden',
      title: 'Kunden',
      type: 'item',
      url: '/kunden',
      icon: icons.TeamOutlined
    },
    {
      id: 'einstellungen',
      title: 'Einstellungen',
      type: 'item',
      url: '/einstellungen',
      icon: icons.SettingOutlined
    }
  ]
};

export default verwaltung;
