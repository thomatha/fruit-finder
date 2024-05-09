import { isErrored } from "stream";
import useSWR, {Fetcher} from "swr";

export function useUserReviews (id: string) {
    const {data, error, isLoading} = useSWR(`/api/reviews?user_id=${id}`, fetch)

    console.log("From userReview: ", data);

    return {
        user: data,
        isLoading,
        isError: error
    }
}