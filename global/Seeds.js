import {
  addWhislist,
  message,
  whatsapp,
  instagram1,
  messenger,
  link,
  more,
  facebook,
} from './Images';

const menus = [
  {
    title: 'Users',
    status: false,
    checked: false,
    tab: 2,
  },

  {
    title: 'Crafts',
    checked: false,
    status: false,
    child: [
      { title: 'Art', tab: 4 },
      { title: 'Music', tab: 3 },
      { title: 'Brand Items', tab: 0 },
      {
        title: 'Shop',
        status: false,
        checked: false,
        tab: 1,
      },
    ],
  },
  {
    title: 'Craftlists',
    status: false,
    checked: false,
    tab: 0,
  },
];
const PurchaseOptions = [
  {
    label: 'Free',
    status: true,
  },
  {
    label: 'Lease',
    status: true,
  },
  {
    label: 'Buy Exclusive',
    status: false,
  },
];
const userType = [
  {
    icon: 'music',
    label: 'Musician',
    status: true,
  },
  {
    icon: 'brush',
    label: 'Artist',
    status: true,
  },
  {
    icon: 'briefcase',
    label: 'Brand',
    status: false,
  },
  {
    icon: 'heart',
    label: 'Patron',
    status: false,
  },
];

const colors = [
  {
    color: '#ba1fa2',
    status: true,
  },
  {
    color: '#6b1fba',
    status: true,
  },
  {
    color: '#1f22ba',
    status: true,
  },
  {
    color: '#3acecc',
    status: false,
  },
  {
    color: '#ffffff',
    status: false,
  },
  {
    color: '#666666',
    status: false,
  },
  {
    color: '#000000',
    status: false,
  },
];

const social_share = [
  {
    image: addWhislist,
    text: 'Add to Craftlist',
    tab: 5,
  },
  {
    image: link,
    text: 'Copy link',
  },
  {
    image: more,
    text: 'More',
  },
];

const social = [
  {
    image: addWhislist,
    text: 'Add to Craftlist',
    tab: 5,
  },
  {
    image: message,
    text: 'Messages',
  },
  {
    image: whatsapp,
    text: 'WhatsApp',
  },
  {
    image: instagram1,
    text: 'Instagram Stories',
  },
  {
    image: messenger,
    text: 'Messenger',
  },
  {
    image: facebook,
    text: 'Facebook',
  },
  {
    image: link,
    text: 'Copy link',
  },
  {
    image: more,
    text: 'More',
  },
];

const sharelink = [
  /*
  {
    image: facebook,
    text: 'Facebook',
  },
  */
  {
    image: whatsapp,
    text: 'WhatsApp',
  },
  {
    image: instagram1,
    text: 'Instagram',
  },

  {
    image: link,
    text: 'Google Plus',
  },
];

const comments = [
  {
    type: 'text',
    name: 'Sarah',
    time: '6m',
    like: 10,
  },
  {
    type: 'text',
    name: 'Newton',
    time: '6m',
    like: 10,
  },
  {
    type: 'slide',
    name: 'Newton',
    time: '6m',
    like: 10,
  },
  {
    type: 'image',
    name: 'Sarah',
    time: '6m',
    like: 10,
  },
  {
    type: 'video',
    name: 'Sarah',
    time: '6m',
    like: 10,
  },
];

export { menus, PurchaseOptions, userType, colors, sharelink, social, social_share, comments };
