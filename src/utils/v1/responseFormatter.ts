

/**
 * @description to format response for all apis with pagination for append
 * @param list 
 * @param limit 
 */

export const formatPaginationResponse = (list, limit) => {
    try {
        if (list.length == limit + 1) {
            list.pop()
            return {
                "data": list,
                "nextPageStatus": true
            }
        } else {
            return {
                "data": list,
                "nextPageStatus": false
            }
        }
    }
    catch (error) {
        //console.log("Error in formating pagination response", error)
        return {}
    }
}

