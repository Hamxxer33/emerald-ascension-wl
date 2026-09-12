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
    id: "engage",
    label: "Like, comment, repost, and turn on notifications",
    url: "https://x.com/EmeraldAscen",
    required: true,
  },
];

export const STORAGE_KEY = "emerald-ascension.wl.v2";
