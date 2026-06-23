import { type ApiResponseFail, type BaseApiResponseSuccess } from "../../utils/apiRequest"

export type UserInfo = {
    username: string
    profile_pic_url: string | null
    created_at: string
}

type AuthResponseDataType = {user_info: UserInfo}
type AuthResponseSuccess = BaseApiResponseSuccess<AuthResponseDataType>
export type AuthResponse = ApiResponseFail | AuthResponseSuccess

type LoginResponseDataType = {user_info: UserInfo}
type LoginResponseSuccess = BaseApiResponseSuccess<LoginResponseDataType>
export type LoginResponse = ApiResponseFail | LoginResponseSuccess

type SignupResponseSuccess = BaseApiResponseSuccess<null>
export type SignupResponse = ApiResponseFail | SignupResponseSuccess