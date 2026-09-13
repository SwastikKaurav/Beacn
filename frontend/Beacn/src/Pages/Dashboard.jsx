import EndpointList from "../Components/EndpointList";
import NewEndpointModal from "../Components/newEndpointModal";
import { useState, useEffect } from "react";
import { getEndpoints, getKpiStats } from "../api/endpoints";
import "./Dashboard.css";

export default function Dashboard(){
    let [endpoints, setEndpoint] = useState([]);
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState(false);
    let [kpiStats, setKpiStats] = useState({});

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
        <div className="dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Dashboard</h1>
                <NewEndpointModal onEndpointCreated={handleEndpointCreated}/>
            </div>

            <div className="kpi-strip">
                <div className="kpi-card">
                    <span className="kpi-label">Endpoints</span>
                    <span className="kpi-value">{endpoint_count}</span>
                </div>
                <div className="kpi-card">
                    <span className="kpi-label">Incidents</span>
                    <span className={`kpi-value ${kpiStats.incidents > 0 ? "kpi-value--warn" : ""}`}>
                        {kpiStats.incidents ?? "—"}
                    </span>
                </div>
                <div className="kpi-card">
                    <span className="kpi-label">Uptime</span>
                    <span className="kpi-value">
                        {kpiStats.uptime_percentage != null ? `${kpiStats.uptime_percentage.toFixed(1)}%` : "—"}
                    </span>
                </div>
                <div className="kpi-card">
                    <span className="kpi-label">Avg Response</span>
                    <span className="kpi-value mono">
                        {kpiStats.avg_response_time != null ? `${(kpiStats.avg_response_time * 1000).toFixed(0)}ms` : "—"}
                    </span>
                </div>
            </div>

            <EndpointList
                endpoints_prop={endpoints}
                loading_prop={loading}
                error_prop={error}
                onEndpointUpdated={handleEndpointUpdated}
                onEndpointDelete={handleEndpointDelete}
            />
        </div>
    )
}