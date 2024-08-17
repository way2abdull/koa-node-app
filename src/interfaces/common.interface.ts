export namespace ICommonInterface {
  export interface PaginationResult {
    next: boolean;
    data: any[];
    limit?: number;
    page: number;
    total?: number;
    nextHit?: boolean;
  }

  export interface Pagination {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string; //FIELD NAME FOR SORTING
    orderBy?: string; //ASCENDING/DESCENDING
  }

  export interface INotification {
    pushNotification: boolean;
  }

  export interface SendMessage {
		to: string;
		message: string;
	}

}
