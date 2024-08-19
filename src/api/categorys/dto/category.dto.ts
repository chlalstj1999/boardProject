interface IcategoryDto {
  categoryIdx?: number;
  categoryName?: string;
}

interface IcategoryResponseDto {
  getCategorysDto(
    data: {
      idx: number;
      name: string;
    }[]
  ): CategoryDto[];
}

export class CategoryDto implements IcategoryDto, IcategoryResponseDto {
  categoryIdx?: number;
  categoryName?: string;

  constructor(data?: Partial<IcategoryDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  getCategorysDto(
    data: {
      idx: number;
      name: string;
    }[]
  ): CategoryDto[] {
    return data.map((item) => {
      const categoryDto = new CategoryDto();
      categoryDto.categoryIdx = item.idx;
      categoryDto.categoryName = item.name;
      return categoryDto;
    });
  }
}
