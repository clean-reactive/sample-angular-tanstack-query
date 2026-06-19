export interface ApiOrderDto {
  id: string;
  userId: string;
  items: ApiOrderItemDto[];
}

export interface ApiOrderItemDto {
  id: string;
  productId: string;
  quantity: number;
}
