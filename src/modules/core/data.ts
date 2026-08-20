import { IconType } from "react-icons";

export const footerData = {
  contactDetails: {
    address: "Kathmandu - Janakpurdham",
    contact: "+977 981-426-5196",
    email: "info@bazzarify.com",
    openingTime: "Open time: 8:00AM - 6:00PM",
  },
  menu: {
    Information: [
      {
        id: 1,
        label: "About Company",
        link: "#",
      },
      {
        id: 2,
        label: "Contact Us",
        link: "#",
      },
      {
        id: 3,
        label: "FAQ",
        link: "#",
      },
      {
        id: 4,
        label: "Featured Products",
        link: "#",
      },
      {
        id: 5,
        label: "Latest Products",
        link: "#",
      },
      {
        id: 6,
        label: "Privacy Policies",
        link: "#",
      },
      {
        id: 7,
        label: "Terms & Conditions",
        link: "#",
      },
    ],
    Account: [
      // {
      //   id: 8,
      //   label: "Log In",
      //   link: "#",
      // },
      // {
      //   id: 9,
      //   label: "Registration",
      //   link: "#",
      // },
      {
        id: 10,
        label: "Vendor Log In",
        link: "#",
      },
      {
        id: 11,
        label: "Vendor Registration",
        link: "#",
      },
    ],
    Services: [
      {
        id: 12,
        label: "Contact Us",
        link: "#",
      },
      {
        id: 13,
        label: "Support",
        link: "#",
      },
      {
        id: 14,
        label: "Customer Service",
        link: "#",
      },
    ],
  },
};

export const categoriesData = [
  "Women Fashion",
  "Men Fashion",
  "Electronic Devices",
  "Health Care",
  "Watches, Bags, Jewellery",
  "Home & Lifestyle",
  "TV & Home Appliances",
  "Pets & Groceries",
  "Electronic Accessories",
  "Babies & Toys",
  "Sports & Outdoor",
  "Motors, Tools & DIY",
];

export type TMenuLink = {
  type: "link";
  icon: IconType;
  title: string;
  path: string;
};

export type TMenuGroup = {
  type: "group";
  icon: IconType;
  title: string;
  defaultPath: string;
  pathMatch: string;
  children: TMenuLink[];
};

export type TMenuEntry = TMenuLink | TMenuGroup;
