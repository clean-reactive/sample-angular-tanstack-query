import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { ApiOrderDto } from './types';

export const apiOrdersResource = '/api/orders';

@Injectable()
export class ApiOrdersService {
  private readonly http = inject(HttpClient);

  getOrders(): Observable<ApiOrderDto[]> {
    return this.http.get<ApiOrderDto[]>(apiOrdersResource);
  }

  getOrder(id: string): Observable<ApiOrderDto> {
    return this.http.get<ApiOrderDto>(`${apiOrdersResource}/${id}`);
  }

  updateOrder(id: string, order: ApiOrderDto): Observable<void> {
    return this.http.put<void>(`${apiOrdersResource}/${id}`, order);
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${apiOrdersResource}/${id}`);
  }
}
