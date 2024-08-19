interface IpostDto {
  categoryIdx?: number;
  postIdx?: number;
  accountIdx?: number;
  title?: string;
  content?: string;
  likes?: number;
  createdAt?: Date;
  author?: string;
  authorIdx?: number;
  imageUrls?: string[];
}

interface IpostResponseDto {
  getPostListsDto(
    data: {
      postIdx: number;
      userName: string;
      title: string;
      createdAt: Date;
      countLike: number;
    }[]
  ): PostDto[];
}

export class PostDto implements IpostDto, IpostResponseDto {
  categoryIdx?: number;
  postIdx?: number;
  accountIdx?: number;
  title?: string;
  content?: string;
  likes?: number;
  createdAt?: Date;
  author?: string;
  authorIdx?: number;
  imageUrls?: string[];

  constructor(data?: Partial<IpostDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  getPostListsDto(
    data: {
      postIdx: number;
      userName: string;
      title: string;
      createdAt: Date;
      countLike: number;
    }[]
  ): PostDto[] {
    return data.map((item) => {
      const postDto = new PostDto();
      postDto.postIdx = item.postIdx;
      postDto.author = item.userName;
      postDto.title = item.title;
      postDto.createdAt = item.createdAt;
      postDto.likes = item.countLike;
      return postDto;
    });
  }
}
