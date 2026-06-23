import { type ApiResponseFail, type BaseApiResponseSuccess } from "../../utils/apiRequest"

export type LibraryEntry = {
    gameID: number
    added_at: string
}

type LoadLibraryResponseDataType = LibraryEntry[]
type LoadLibraryResponseSuccess = BaseApiResponseSuccess<LoadLibraryResponseDataType>
export type LoadLibraryResponse = ApiResponseFail | LoadLibraryResponseSuccess

type AddToLibraryResponseDataType = {gameID: number, added_at: string}
type AddToLibraryResponseSuccess = BaseApiResponseSuccess<AddToLibraryResponseDataType>
export type AddToLibraryResponse = ApiResponseFail | AddToLibraryResponseSuccess

type RemoveFromLibraryResponseSuccess = BaseApiResponseSuccess<null>
export type RemoveFromLibraryResponse = ApiResponseFail | RemoveFromLibraryResponseSuccess