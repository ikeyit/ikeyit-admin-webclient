import {useEffect, useState} from "react";
import {ajax} from "../../common/ajax.js";
import {useAsync} from "ikeyit-react-easy";
import {useSearchParams} from "react-router-dom";
import {isEqual, pickBy} from "lodash";

export function useBasicData() {
    const {data, error, status, execute} = useAsync(
        () =>
            Promise.all([ajax.get("/messenger/api/channels"), ajax.get("/messenger/api/categories")])
                .then(([channels, categories]) => ({
                        channels,
                        channelMap: new Map(channels.map(o => [o.name, o])),
                        categories,
                        categoryMap: new Map(categories.map(o => [o.categoryId, o])),
                    })
                ),
        {
        init: {
            data: {
                channels: [],
                channelMap: new Map(),
                categories: [],
                categoryMap: new Map(),
            },
        }
    });
    useEffect(() => {
        execute();
    }, []);

    return {basicData: data, status, error, execute};
}

function toInt(value) {
    return value === null || value === undefined ? null : parseInt(value);
}

function toInts(value) {
    return value === null || value === undefined ? null : value.map(v => toInt(v));
}

function normalizeCreativeSearchParams(searchParams) {
    return pickBy({
        page: toInt(searchParams.get("page")),
        count: toInt(searchParams.get("count")),
        creativeId: toInts(searchParams.getAll("creativeId")),
        channel: searchParams.get("channel"),
        name: searchParams.get("name"),
        categoryId: toInt(searchParams.get("categoryId")),
        creatorId: searchParams.get("creatorId"),
        status: toInt(searchParams.get("status")),
    });
}

export function useCreativeSearcher() {
    let [searchParams, setSearchParams] = useSearchParams();
    const {data, error, status, execute, setData} = useAsync(params => ajax.get("/messenger/api/creatives", {params}), {
        init: {
            data: {},
        }
    });
    const params = normalizeCreativeSearchParams(searchParams);
    useEffect(() => {
        execute(normalizeCreativeSearchParams(searchParams));
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

export function useSubmitCreative(options) {
    return useAsync(data => ajax({
            method: data.creativeId ? "put" : "post",
            url: "/messenger/api/creative",
            data
        }),
        options
    );
}
export function useSendCreative(options) {
    return useAsync(data => ajax.post(data.directly ? "/messenger/api/creative/send" : "/messenger/api/creative/send?async=true", data),
        options
    );
}

export function useGetCreativePreview(initCreativeData) {
    return useAsync(
        creativeId => ajax.get("/messenger/api/creative/" + creativeId),
        {
            init: {
                data: initCreativeData
            }
        }
    );
}

export function useSearchCreative() {
    return useAsync(params => ajax.get("/messenger/api/creatives", {
        params
    }), {
        init: {
            data: {
                list: []
            }
        }
    });
}