import { useParams } from "react-router-dom";
import { getPings, getEndpointById } from "../api/endpoints"
import { useEffect, useState } from "react"
import {XAxis, YAxis, Line, CartesianGrid, ResponsiveContainer, LineChart, Tooltip} from "recharts"

export default function DetailPage(){
    let [pings, setPings] = useState([]);
    let [endpoint, setEndpoint] = useState([]);
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState(false);

    let { id } = useParams();
    useEffect(()=>{
        async function fetchPings(){
            try{
                let response_endpoint = await getEndpointById(id);
                setEndpoint(response_endpoint)
                
                let response = await getPings(id);
                setLoading(false);
                setPings(response);
            }
            catch (e){
                setError(true);
                setLoading(false);
            }
        }
        fetchPings();
    },[])



    return(
        <>  
            {loading && <p>Loading...</p>}
            {error && <p>Something went wrong</p>}
            {!loading && !error && <pre>{JSON.stringify(endpoint, null, 2)}</pre>}
            {!loading && !error && <ResponsiveContainer width = "100%" height={300}>
                <LineChart data={pings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="checked_at" 
                        tickFormatter={(value) => {
                            let date = new Date(value);
                            return date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
                        }}
                        interval="preserveStartEnd"
                    />
                    <YAxis label={{ value: "Response Time (s)", angle: -90, position: "insideLeft" }} />    
                    <Tooltip />
                    <Line type="natural" dataKey="response_time" stroke="#E8A33D" dot={false} activeDot={{r:4}}/>
                </LineChart>
            </ResponsiveContainer>
            }
        </>
    )
}