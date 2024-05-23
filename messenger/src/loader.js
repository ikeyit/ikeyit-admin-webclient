import {ajax} from "../../common/ajax.js";

export async function creativeDetailLoader({params}) {
    return await ajax.get(`/messenger/api/creative/${params.creativeId}` );
}

export async function creativeNewLoader({request}) {
    const {searchParams} = new URL(request.url);
    const creativeId = searchParams.get("from");
    if (creativeId) {
        const fromCreative = await creativeDetailLoader({params:{creativeId}});
        return {
            ...fromCreative,
            status: 1,
            creativeId: 0,
            name: "(Copied)" + fromCreative.name,
        };
    }

    const channel = searchParams.get("channel") || "sms";
    return {
        categoryId: 1,
        channel: channel,
        status: 1,
        name: `New ${channel} creative`,
        content: {}
    };
}


export async function activateCreative(creativeId) {
    return await ajax.post("/messenger/api/creative/activate", {
        creativeId
    });
}

export async function deactivateCreative(creativeId) {
    return await ajax.post("/messenger/api/creative/deactivate", {
        creativeId
    });
}