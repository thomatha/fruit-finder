import useSWR from "swr";

export function useUserReviews (id: string) {

    const fetcher = url => fetch(url).then(r => r.json())

    const {data, error} = useSWR(`/api/reviews?user_id=${id}`, fetcher)

    console.log("From userReview: ", data);

    return {
        user: data,
        isError: error
    }
}