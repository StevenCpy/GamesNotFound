import { type ApiResponseFail, type BaseApiResponseSuccess } from "../../utils/apiRequest"

export type StoreEntry = {
    gameID: number
    name: string
    cover_image_url: string
    description: string
    author: string
    version: string
    is_playable: boolean
    library_adds: number
    uploaded_on: string
}

type LoadStoreResponseDataType = StoreEntry[]
type LoadStoreResponseSuccess = BaseApiResponseSuccess<LoadStoreResponseDataType>
export type LoadStoreResponse = ApiResponseFail | LoadStoreResponseSuccess