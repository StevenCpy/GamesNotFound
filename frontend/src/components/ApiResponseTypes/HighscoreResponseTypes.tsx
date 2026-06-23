import { type ApiResponseFail, type BaseApiResponseSuccess } from "../../utils/apiRequest"

export type Highscore = {
    gameID: number
    high_score: number
    last_played: string
}
type HighscoresResponseDataType = Highscore[]
type HighscoresResponseSuccess = BaseApiResponseSuccess<HighscoresResponseDataType>
export type HighscoresResponse = ApiResponseFail | HighscoresResponseSuccess

type SubmitScoreResponseDataType = {high_score: number, last_played: string}
type SubmitScoreResponseSuccess = BaseApiResponseSuccess<SubmitScoreResponseDataType> & {
    message: string
}
export type SubmitScoreResponse = ApiResponseFail | SubmitScoreResponseSuccess