export const BRAND = {
  name: "Emerald Ascension",
  handle: "@EmeraldAscen",
  xUrl: "https://x.com/EmeraldAscen",
  bio: "2222 Emerald coming on @Robinhoodapp",
  avatar: "/assets/avatar.jpg",
  banner: "/assets/banner.jpg",
} as const;

export type Task = {
  id: string;
  label: string;
  url: string;
  required: boolean;
};

export const TASKS: Task[] = [
  {
    id: "follow",
    label: "Follow @EmeraldAscen",
    url: "https://x.com/EmeraldAscen",
    required: true,
  },
  {
    id: "engage-2098795348852678947",
    label: "Like, comment, repost, and turn on notifications",
    url: "https://x.com/EmeraldAscen/status/2098795348852678947",
    required: true,
  },
  {
    id: "engage-2099410478212755610",
    label: "Like, comment, and repost this post",
    url: "https://x.com/EmeraldAscen/status/2099410478212755610",
    required: true,
  },
];

export const STORAGE_KEY = "emerald-ascension.wl.v3";
