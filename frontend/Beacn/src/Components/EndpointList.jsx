import { Link } from "react-router-dom";  
import UpdateEndpointModal from "./UpdateEndpointModal";
import { deleteEndpoint } from "../api/endpoints";
import "./EndpointList.css";

export default function EndpointList({endpoints_prop, loading_prop, error_prop, onEndpointUpdated, onEndpointDelete}){

    async function handleDelete(endpoint_id){
        try{
            let data = await deleteEndpoint(endpoint_id);
            onEndpointDelete(endpoint_id);
        }
        catch(e){
            alert("Failed to delete endpoint");
        }
    }

   return (
    <div className="endpoint-table-wrap">
        {loading_prop && <p className="state-msg">Loading endpoints…</p>}
        {error_prop && <p className="state-msg state-msg--error">Something went wrong</p>}
        {!loading_prop && !error_prop && endpoints_prop.length === 0 && (
            <p className="state-msg">No endpoints yet — add one to start monitoring.</p>
        )}
        {!loading_prop && !error_prop && endpoints_prop.length > 0 && (
            <table className="endpoint-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>URL</th>
                        <th>Interval</th>
                        <th className="col-actions">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {endpoints_prop.map((endpoint) => (
                        <tr key={endpoint.id}>
                            <td>
                                <Link to={`/endpoints/${endpoint.id}`} className="endpoint-name-link">
                                    {endpoint.name}
                                </Link>
                            </td>
                            <td className="mono col-url">{endpoint.url}</td>
                            <td className="mono">{endpoint.ping_interval}s</td>
                            <td className="col-actions">
                                <div className="row-actions">
                                    <UpdateEndpointModal endpoint={endpoint} onEndpointUpdated={onEndpointUpdated}/>
                                    <button className="btn btn--danger" onClick={() => handleDelete(endpoint.id)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
    )
}