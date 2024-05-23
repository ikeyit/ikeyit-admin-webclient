import {ajax} from "../../common/ajax.js";

export async function getSequence({params}) {
    return await ajax.get(`/idgen/api/sequence/${params.name}` );
}

export async function sequenceNewLoader() {
    return {
        type: 3,
        status: 1,
        name: "",
        maxId: 1,
        step: 1000
    };
}


export async function activateSequence(name) {
    return await ajax.post("/idgen/api/sequence/activate", {
        name
    });
}