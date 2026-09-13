export async function getEndpoints(){
    let response = await fetch("http://localhost:8000/endpoints/")
    if (response.ok){
        let data = await response.json();
        return data;
    }
    else{
        throw new Error(response.status)
    }
}

export async function getPings(endpoint_id){
    let response = await fetch(`http://localhost:8000/endpoints/${endpoint_id}/pings`)
    if(response.ok){
        let data = await response.json();
        return data;
    }
    else{
        throw new Error(response.status)
    }
}

export async function getEndpointById(endpoint_id){
    let response = await fetch(`http://localhost:8000/endpoints/${endpoint_id}`)
    if(response.ok){
        let data = await response.json();
        return data;
    }
    else{
        throw new Error(response.status)
    }
}

export async function createEndpoint(data){
    let response = await fetch("http://localhost:8000/endpoints/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    if(response.ok){
        let response_data = await response.json();
        return response_data;
    }
    else{
        throw new Error(response.status)
    }
}

export async function updateEndpoint(endpoint_id, data){
    let response = await fetch(`http://localhost:8000/endpoints/${endpoint_id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    if(response.ok){
        let response_data = await response.json();
        return response_data;
    }
    else{
        throw new Error(response.status);
    }
}

export async function deleteEndpoint(endpoint_id){
    let response = await fetch(`http://localhost:8000/endpoints/${endpoint_id}`,{
        method: "DELETE"
    })
    if(response.ok){
        let data  = await response.json();
        return data;
    }
    else{
        throw new Error(response.status)
    }
}

export async function getKpiStats(){
    let response = await fetch("http://localhost:8000/endpoints/kpi")
    if(response.ok){
        let data = await response.json();
        return data;
    }
    else{
        throw new Error(response.status)
    }
}
