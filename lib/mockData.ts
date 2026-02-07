export interface Post {
  id: number;
  author: string;
  content: string;
  likes: number;
  time: string;
  weight: number;
}

export const mockPosts: Post[] = [
  {
    id: 1,
    author: 'Caloy',
    content: 'Just finished a workout! #GymForLife',
    likes: 12,
    time: '2m ago',
    weight: 0.9
  },
  {
    id: 2,
    author: 'Roberto',
    content: 'Check out this sunset!',
    likes: 45,
    time: '1h ago',
    weight: 0.7
  },
  {
    id: 3,
    author: 'Berting',
    content: 'Algorithm Testing in progress',
    likes: 5,
    time: '5h ago',
    weight: 0.4
  },
  {
    id: 4,
    author: 'Rob',
    content: 'Just finished a workout! #GymForLife',
    likes: 23,
    time: '5m ago',
    weight: 0.9
  },
  {
    id: 5,
    author: 'Dan',
    content: 'Check out this sunset!',
    likes: 50,
    time: '2h ago',
    weight: 0.7
  },
  {
    id: 6,
    author: 'Richard',
    content: 'Algorithm Testing in progress',
    likes: 70,
    time: '1D ago',
    weight: 0.4
  }
];
