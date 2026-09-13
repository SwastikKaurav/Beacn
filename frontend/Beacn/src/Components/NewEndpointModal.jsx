import { useState } from "react";
import { createEndpoint } from "../api/endpoints";
import "./Modal.css";

export default function NewEndpointModal({onEndpointCreated}){
    let [name, setName] = useState("");
    let [url, setUrl] = useState("");
    let [pingInterval, setPingInterval] = useState("");
    let [isAdding, setIsAdding] = useState(false);

    function handleNameChange(e){ setName(e.target.value); }
    function handleUrlChange(e){ setUrl(e.target.value); }
    function handlePingIntervalChange(e){ setPingInterval(e.target.value); }

    async function handleSubmit(e){
        e.preventDefault();
        let data = {"name":name, "url":url, "ping_interval":parseInt(pingInterval)};
        let response = await createEndpoint(data);
        onEndpointCreated(response);
        setIsAdding(false);
        setName(""); setUrl(""); setPingInterval("");
    }

    function handleAdding(){ setIsAdding(true); }

    return(
        <>
            {isAdding ?
            <div className="modal-overlay" onClick={() => setIsAdding(false)}>
                <form className="modal-card" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                    <h2 className="modal-title">Add Endpoint</h2>

                    <label className="field-label">Name</label>
                    <input className="field-input" value={name} onChange={handleNameChange}/>

                    <label className="field-label">URL</label>
                    <input className="field-input mono" value={url} onChange={handleUrlChange}/>

                    <label className="field-label">Ping Interval (seconds)</label>
                    <input className="field-input mono" value={pingInterval} onChange={handlePingIntervalChange} type="number"/>

                    <div className="modal-actions">
                        <button type="button" className="btn" onClick={() => setIsAdding(false)}>Cancel</button>
                        <button type="submit" className="btn btn--primary">Add</button>
                    </div>
                </form>
            </div>
            : <button className="btn btn--primary" onClick={handleAdding}>+ Add Endpoint</button>
            }
        </>
    )
}