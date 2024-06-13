/* eslint-disable react/prop-types */
import "./Node.css";

import MessageIcon from "../../assets/message.svg";
import WhatsappIcon from "../../assets/whatsapp.svg";
import { Handle, Position } from "reactflow";

function Node({ data, isConnectable }) {
  return (
    <div>
      <div className="node">
        <div className="header">
          <div className="title">
            <img src={MessageIcon} alt="message-icon" width="14px" />
            <span>{data.heading}</span>
          </div>
          <img src={WhatsappIcon} alt="Whatsapp-icon" width="14px" />
        </div>
        {/*  */}
        <div className="data">
          <span>{data.label}</span>
        </div>
      </div>
      {/* Connector Points */}
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        isConnectable={isConnectable}
        isConnectableStart={true}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="target"
        isConnectable={true}
        isConnectableEnd={true}
      />
    </div>
  );
}

export default Node;
