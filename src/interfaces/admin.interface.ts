import { ICommonInterface } from "./common.interface";

export namespace IAdmin {
  export interface PaginationResult {
    next: boolean;
    data: any[];
    limit?: number;
    page: number;
    total?: number;
    nextHit?: boolean;
  }

  export interface VersionsPagination extends ICommonInterface.Pagination {
    name?: string;
    status?: string;
    version?: number;
  }

  export interface ContentPagination extends ICommonInterface.Pagination {
    contentType?: string;
    status?: string;
  }

  export interface RolesPagination extends ICommonInterface.Pagination {
    name?: string;
    status?: string;
    version?: number;
  }

  export interface NotificationPagination extends ICommonInterface.Pagination {
    title?: string;
    status?: string;
  }

  export interface SubAdminPagination extends ICommonInterface.Pagination {
    name?: string;
    status?: string;
    version?: number;
  }

  export interface MaintenencebannerPagination
    extends ICommonInterface.Pagination {
    name?: string;
    status?: string;
    version?: number;
  }
}
