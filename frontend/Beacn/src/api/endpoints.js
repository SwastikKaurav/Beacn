async function apiFetch(url, options = {}){
    let response = await fetch(url,optionsReducer)
    if(response.ok){
        let data = await response.json();
        return data;
    }
    else{
        throw new Error(response.status)
    }
}

export async function getEndpoints(){
    return apiFetch("http://localhost:8000/endpoints/")
}

export async function getPings(endpoint_id){
    return apiFetch(`http://localhost:8000/endpoints/${endpoint_id}/pings`)
}

export async function getEndpointById(endpoint_id){
    return apiFetch(`http://localhost:8000/endpoints/${endpoint_id}`)
}

export async function createEndpoint(data){
    return apiFetch("http://localhost:8000/endpoints/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
}

export async function updateEndpoint(endpoint_id, data){
    return apiFetch(`http://localhost:8000/endpoints/${endpoint_id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
}

export async function deleteEndpoint(endpoint_id){
    return apiFetch(`http://localhost:8000/endpoints/${endpoint_id}`,{
        method: "DELETE"
    })
}

export async function getKpiStats(){
    return apiFetch("http://localhost:8000/endpoints/kpi")
}
