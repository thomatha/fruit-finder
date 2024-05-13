import useSWR from "swr";

export function useUserReviews (id: string) {

    const fetcher = url => fetch(url).then(r => r.json())

    const {data, error} = useSWR(`/api/reviews?user_id=${id}`, fetcher)

    if(data){
        data.map(review => {
            var utc = new Date(review.created);
            var offset = utc.getTimezoneOffset();
            var local = new Date(utc.getTime() - offset * 60000);
            review.created = local.toLocaleString();
    })}

    return {
        user: data,
        isError: error
    }
}