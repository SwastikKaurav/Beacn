import { useState } from "react";
import { updateEndpoint } from "../api/endpoints";
import "./Modal.css";

export default function UpdateEndpointModal({endpoint, onEndpointUpdated}){
    let [name, setName] = useState(endpoint.name);
    let [url, setUrl] = useState(endpoint.url);
    let [pingInterval, setPingInterval] = useState(endpoint.ping_interval);
    let [isEditing, setIsEditing] = useState(false);

    function handleNameChange(e){ setName(e.target.value); }
    function handleUrlChange(e){ setUrl(e.target.value); }
    function handlePingIntervalChange(e){ setPingInterval(e.target.value); }

    async function handleSubmit(e){
        e.preventDefault();
        let data = {"name":name, "url":url, "ping_interval":parseInt(pingInterval)};
        try{
            let response = await updateEndpoint(endpoint.id, data);
            onEndpointUpdated(response);
            setIsEditing(false);
        }
        catch (e) {
            alert("Failed to update endpoint");
        }
    }

    function handleEdit(){ setIsEditing(true); }

    return(
        <>
            {isEditing ?
            <div className="modal-overlay" onClick={() => setIsEditing(false)}>
                <form className="modal-card" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                    <h2 className="modal-title">Edit Endpoint</h2>

                    <label className="field-label">Name</label>
                    <input className="field-input" value={name} onChange={handleNameChange}/>

                    <label className="field-label">URL</label>
                    <input className="field-input mono" value={url} onChange={handleUrlChange}/>

                    <label className="field-label">Ping Interval (seconds)</label>
                    <input className="field-input mono" value={pingInterval} onChange={handlePingIntervalChange} type="number"/>

                    <div className="modal-actions">
                        <button type="button" className="btn" onClick={() => setIsEditing(false)}>Cancel</button>
                        <button type="submit" className="btn btn--primary">Save</button>
                    </div>
                </form>
            </div>
            : <button className="btn" onClick={handleEdit}>Edit</button>}
        </>
    )
}