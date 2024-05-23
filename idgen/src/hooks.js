import {useEffect} from "react";
import {ajax} from "../../common/ajax.js";
import {useAsync} from "ikeyit-react-easy";
import {useSearchParams} from "react-router-dom";
import {isEqual, pickBy} from "lodash";

function toInt(value) {
    return value === null || value === undefined ? null : parseInt(value);
}

function toInts(value) {
    return value === null || value === undefined ? null : value.map(v => toInt(v));
}

function normalizeSequenceSearchParams(searchParams) {
    return pickBy({
        page: toInt(searchParams.get("page")),
        count: toInt(searchParams.get("count")),
        name: searchParams.get("name"),
        status: toInt(searchParams.get("status")),
    });
}

export function useSequenceSearcher() {
    let [searchParams, setSearchParams] = useSearchParams();
    const {data, error, status, execute, setData} = useAsync(params => ajax.get("/idgen/api/sequences", {params}), {
        init: {
            data: {},
        }
    });
    const params = normalizeSequenceSearchParams(searchParams);
    useEffect(() => {
        execute(normalizeSequenceSearchParams(searchParams));
    },[searchParams]);

    function search(data) {
        const newParams = pickBy(data);
        if (isEqual(newParams, params)) {
            execute(newParams);
        } else {
            setSearchParams(newParams);
        }
    }
    return {data, error, status, params, search, setData};
}

export function useSubmitSequence(options) {
    return useAsync(data => ajax({
            method: data.isNew ? "isNew" : "put",
            url: "/idgen/api/sequence",
            data
        }),
        options
    );
}