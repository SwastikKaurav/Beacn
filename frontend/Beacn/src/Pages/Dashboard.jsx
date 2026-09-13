import EndpointList from "../Components/EndpointList";
import NewEndpointModal from "../Components/newEndpointModal";
import { useState, useEffect } from "react";
import { getEndpoints } from "../api/endpoints"; 
import { getKpiStats } from "../api/endpoints";

export default function Dashboard(){
    let [endpoints, setEndpoint] = useState([]);
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState(false);
    let [kpiStats, setKpiStats] = useState([]);

    useEffect(()=>{
        async function fetchData(){
            try{
                let endpoint_list = await getEndpoints();
                setEndpoint(endpoint_list)

                let kpi_stats = await getKpiStats();
                setKpiStats(kpi_stats);

                setLoading(false);
            }
            catch (e){
                setError(true);
                setLoading(false);
            }
        }
        fetchData();
    },[])

    function handleEndpointCreated(newEndpoint){
        setEndpoint([...endpoints, newEndpoint])
    }

    function handleEndpointUpdated(updatedEndpoint){
        setEndpoint(endpoints.map((each)=>
            each.id === updatedEndpoint.id ? updatedEndpoint:each
        ))
    }

    function handleEndpointDelete(endpoint_id){
        setEndpoint(endpoints.filter((each)=> each.id !== endpoint_id))
    }

    let endpoint_count = endpoints.length;

    return(
        <>
            <p>Endpoints : {endpoint_count}</p>
            <p>Incidents : {kpiStats.incidents}</p>
            <p>Uptime Percentage : {kpiStats.uptime_percentage}</p>
            <p>Average Response Time : {kpiStats.avg_response_time}</p>
            <NewEndpointModal onEndpointCreated={handleEndpointCreated}/>
            <EndpointList endpoints_prop={endpoints} loading_prop={loading} error_prop={error} onEndpointUpdated={handleEndpointUpdated} onEndpointDelete={handleEndpointDelete}/>
        </>
    )
}