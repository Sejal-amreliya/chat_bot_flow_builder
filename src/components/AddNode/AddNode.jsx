import "./AddNode.css";

import Add from "../../assets/add.svg";

function AddNode() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div>
      <p style={{fontWeight:600}}>Drag and Drop to add new message</p>
      <div
        className="add-message"
        draggable
        onDragStart={(event) => onDragStart(event, "custom")}
        title="Drag and Drop to add new message"
      >
        <img src={Add} alt="add node icon" draggable={false} />
        <span draggable={false}>Message</span>
      </div>
    </div>
  );
}

export default AddNode;
