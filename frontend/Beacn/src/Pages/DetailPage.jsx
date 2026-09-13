import { useParams, Link } from "react-router-dom";
import { getPings, getEndpointById } from "../api/endpoints"
import { useEffect, useState } from "react"
import {XAxis, YAxis, Line, CartesianGrid, ResponsiveContainer, LineChart, Tooltip} from "recharts"
import "./DetailPage.css";

export default function DetailPage(){
    let [pings, setPings] = useState([]);
    let [endpoint, setEndpoint] = useState({});
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

    if (loading) return <p className="state-msg">Loading…</p>;
    if (error) return <p className="state-msg state-msg--error">Something went wrong</p>;

    let recentPings = [...pings].slice(-10).reverse();

    return(
        <div className="detail-page">
            <Link to="/" className="back-link">← Back to Dashboard</Link>

            <div className="detail-header">
                <h1 className="detail-title">{endpoint.name}</h1>
                <span className="detail-url mono">{endpoint.url}</span>
            </div>

            <div className="chart-card">
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={pings}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                        <XAxis
                            dataKey="checked_at"
                            tickFormatter={(value) => {
                                let date = new Date(value);
                                return date.toLocaleString([], { month: "short", day: "numeric" });
                            }}
                            interval="preserveStartEnd"
                            tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
                        />
                        <YAxis
                            label={{ value: "Response Time (s)", angle: -90, position: "insideLeft", fill: "var(--text-secondary)" }}
                            tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
                        />
                        <Tooltip
                            contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "6px" }}
                            labelStyle={{ color: "var(--text-secondary)" }}
                        />
                        <Line type="natural" dataKey="response_time" stroke="var(--accent)" dot={false} activeDot={{r:4}}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <h2 className="section-title">Recent Pings</h2>
            <div className="endpoint-table-wrap">
                <table className="endpoint-table">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Response Time</th>
                            <th>Checked At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentPings.map((ping) => {
                            let isUp = ping.status_code >= 200 && ping.status_code < 300;
                            return (
                                <tr key={ping.id}>
                                    <td>
                                        <span className={`status-badge ${isUp ? "status-badge-up" : "status-badge-down"}`}>
                                            {isUp ? "Up" : "Down"}
                                        </span>
                                    </td>
                                    <td className="mono">
                                        {ping.response_time != null ? `${(ping.response_time * 1000).toFixed(0)}ms` : "—"}
                                    </td>
                                    <td className="mono col-url">{new Date(ping.checked_at).toLocaleString()}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}