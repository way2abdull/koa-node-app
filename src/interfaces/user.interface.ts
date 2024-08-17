declare namespace UserRequest {

    export interface Password {
        password?: string
    }

    export interface UserId {
        userId: string
    }

    export interface Register {

        name?: string,
        email?: string;
        password?: string;
    }

    export interface jwt {
        email: string
    }

    export interface PaginationResult {
        next: boolean,
        data: any[],
        page: number,
        total?: number,
        nextHit?: boolean,
        limit: number
    }
    export interface SocialLogin {
        firstName : string,
        lastName : string;
        socialId: string;
        displayName: string;
        email?: string;
        provider?: string;
        profilePicture: string;
        socialType: string;
    }
}