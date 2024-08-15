export type BoardResponse = {
  id: bigint,
  title: string,
  createdAt: string,
  updatedAt: string
};

export type PostSimplifiedResponse = {
  id: bigint,
  title: string,
  view: bigint,
  upvotes: bigint,
  downvotes: bigint,
  author: string,
  memberId: string,
  createdAt: string,
  attachment: string | null
};

export type PostResponse = {
  id: bigint,
  title: string,
  body: string,
  views: bigint,
  upvotes: bigint,
  downvotes: bigint,
  createdAt: string,
  updatedAt: string,
  author: string,
  memberId: string,
  board: BoardResponse,
  attachment: string | null
};

export type CommentResponse = {
  id: bigint,
  content: string,
  memberId: string,
  author: string,
  upvotes: bigint,
  downvotes: bigint,
  createdAt: string,
  updatedAt: string
};

export type PostTagResponse = {
  name: string
};

export type ReactionResponse = {
  id: bigint;
  isUpvoting: boolean;
};

export type S3GetResponseDto = {
  fileNames: string[]
};

export type ChannelBlacklistResponse = {
  channelId: bigint,
  memberId: string
};
