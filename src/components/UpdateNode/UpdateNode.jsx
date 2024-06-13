/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import "./UpdateNode.css";

import ArrowBack from "../../assets/arrow-back.svg";

const UpdateNode = ({ selectedNode, onBack, onUpdateMessage }) => {
  const [label, setLabel] = useState("");
  const updatedLabel = useRef(null);

  useEffect(() => {
    setLabel(selectedNode.data.label);
  }, [selectedNode.id]);

  const handleUpdate = (event) => {
    setLabel(event.target.value);

    // Debouncing
    if (updatedLabel?.current != null) {
      clearTimeout(updatedLabel.current);
    }

    updatedLabel.current = setTimeout(() => {
      onUpdateMessage(event.target.value);
    }, 140);  // update the node text after 100 milliseconds
  };

  return (
    <div className="update-node">
      {/* top */}
      <div className="update-header">
        <img src={ArrowBack} alt="arrow back" onClick={onBack} />
        <span>Update Message</span>
      </div>
      {/* update the message */}
      <div className="update-textarea">
        <label>Text:</label>
        <textarea value={label} onChange={handleUpdate} />
      </div>
    </div>
  );
};

export default UpdateNode;
