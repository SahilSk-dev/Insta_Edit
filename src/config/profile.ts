export interface ProfileConfig {
  displayName: string;
  username: string;
  joinedDate: string;
  followers: string;
  posts: string;
  followsYou: boolean;
  mutualFollowText: string;
  profilePicUrl: string;
  activeFont: 'bonolota' | 'chirkut' | 'mahfuj' | 'system';
  defaultTimestamp: string;
  bubbleColor: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time?: string;
}

// All backend settings are configured here
export const initialProfileConfig: ProfileConfig = {
  displayName: "Sahil Sk",
  username: "md.sahil_sk_",
  joinedDate: "Joined Oct 2025",
  followers: "108 followers",
  posts: "1 post",
  followsYou: true,
  mutualFollowText: "You both follow __broken_heart_019",
  profilePicUrl: "/profile.png",
  activeFont: "bonolota",
  defaultTimestamp: "12:41 PM",
  bubbleColor: "#5e4dfb"
};

export const initialMessages: ChatMessage[] = [
  {
    id: "1",
    text: "Hello",
    sender: "me"
  }
];
