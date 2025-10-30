import {
  Users,
  Settings,

  LayoutGrid,
  LucideIcon,

  ClipboardCheck ,

  Hospital,
  Blocks,

} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;

};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  // groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname?: string): Group[] {
  // export function getMenuList(pathname: string): Group[] {
  return [
    // {
    //   groupLabel: "",
    //   menus: [
    //     {
    //       href: "/dashboard",
    //       label: "Dashboard",
    //       active: pathname.startsWith("/dashboard"),
    //       icon: LayoutGrid,
    //       submenus: []
    //     }
    //   ]
    // },
    {
      // groupLabel: "Contents",
      menus: [
        {
          href: "/laboratory",
          label: "Your Laboratory",
          active: pathname.startsWith("/laboratory"),
          icon: Hospital,
          submenus: [
            // {
            //   href: "/laboratory",
            //   active: pathname.startsWith("/laboratory"),
            //   label: "All Labs",

            // },
            // {
            //   href: "/laboratory/new",
            //   active: pathname.startsWith("/laboratory/new"),
            //   label: "Add Labs",

            // }
          ]
        },
        // {
        //   href: "",
        //   label: "Tests",
        //   active: pathname.startsWith("/tests"),
        //   icon: FlaskConicalOff,
        //   submenus: [
        //     {
        //       href: "/tests",
        //       active: pathname.startsWith("/tests"),
        //       label: "All Tests",

        //     },
        //     {
        //       href: "/tests/new",
        //       active: pathname.startsWith("/tests/new"),
        //       label: "Add Tests",

        //     }
        //   ],
        // },
        {
          href: "/profile",
          label: " Your Offerings",
          active: pathname.startsWith("/profile"),
          icon: Blocks,
          // submenus: [
          //   {
          //     href: "/profile",
          //     active: pathname.startsWith("/profile"),
          //     label: "All Tests",

          //   },
            // {
            //   href: "/profile/addprofile",
            //   active: pathname.startsWith("/profile/addprofile"),
            //   label: "Add Test",
            // }
          // ],
        },
         {
          href: "/subscription",
          label: " Your Subscription",
          active: pathname.startsWith("/subscription"),
          icon: Blocks,
          // submenus: [
          //   {
          //     href: "/profile",
          //     active: pathname.startsWith("/profile"),
          //     label: "All Tests",

          //   },
            // {
            //   href: "/profile/addprofile",
            //   active: pathname.startsWith("/profile/addprofile"),
            //   label: "Add Test",
            // }
          // ],
        },
      {
    href: "/bookings", // 👈 Set main booking route here
    label: "Booking",
    active: pathname.startsWith("/bookings"),
    icon: ClipboardCheck,
  },
      ]
    },
    // {
    //   groupLabel: "Settings",
    //   menus: [
    //     {
    //       href: "/users",
    //       active: pathname.startsWith("/users"),
    //       label: "Users",
    //       icon: Users
    //     },
    //     {
    //       href: "/account",
    //       active: pathname.startsWith("/account"),
    //       label: "Account",
    //       icon: Settings
    //     }
    //   ]
    // }
  ];
}
