async function apiFetch(url, options = {}){
    const token = localStorage.getItem("access_token");
    const headers = {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
    let response = await fetch(url,{...options, headers})
    if(response.ok){
        let data = await response.json();
        return data;
    }
    else{
        const errorData = await response.json()
        throw new Error(errorData.detail)
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

export async function login(email, password){
    let data = {"email":email, "password":password}
    return apiFetch("http://localhost:8000/auth/login",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
}

export async function signup(email, password){
    let data = {"email": email, "password": password}
    return apiFetch("http://localhost:8000/auth/signup",{
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(data)
    })
}
