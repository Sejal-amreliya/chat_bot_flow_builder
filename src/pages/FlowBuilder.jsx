import { useState, useRef, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
} from "reactflow";
import "reactflow/dist/style.css";
import "./FlowBuilder.css";

import Node from "../components/Node"; // custom node
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import UpdateNode from "../components/UpdateNode/UpdateNode";
import AddNode from "../components/AddNode";
import { getUniqueId } from "../util/utilityFunctions";

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = { custom: Node };

const alertTimeoutDuration = 5000;

function FlowBuilder() {
  const [selectedNode, setSelectedNode] = useState();
  const [alertMessage, setAlertMessage] = useState();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  let timeout = useRef();
  const reactFlowWrapper = useRef(null);

  const showAlert = ({ message, type }) => {
    setAlertMessage({ message, type });

    // if timeout is already running then clear the prev timeout
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    // set new time out
    // Auto go away
    timeout.current = setTimeout(() => {
      setAlertMessage(null);
    }, alertTimeoutDuration);
  };

  const isAlreadyASourceNode = (sourceId) => {
    // if any edge is having this node as source then yes this is a source node
    return edges.some((edge) => edge.source === sourceId);
  };

  const onConnect = useCallback(
    (params) => {
      // if source id is already present then skip
      // On node can not be source for two targets
      const sourceId = params.source;

      if (isAlreadyASourceNode(sourceId)) {
        showAlert({
          message:
            "Invalid Connection! Can not connect more than one target from one source",
          type: "warning",
        });
        return;
      }

      setEdges((eds) => addEdge(params, eds));
    },
    [nodes, edges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const getPositionToDrop = (event) => {
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

    const flowAreaStartX = reactFlowBounds.left;
    const flowAreaStartY = reactFlowBounds.top;

    // subtracting 125(half of node width) and 30 so that Node mounts on the cursor pointer in the react flow area
    // 10 is for padding between node and flow area edges
    const x =
      event.clientX - 125 >= flowAreaStartX + 10
        ? event.clientX - 125
        : flowAreaStartX + 10;

    const y =
      event.clientY - 30 >= flowAreaStartY + 10
        ? event.clientY - 30
        : flowAreaStartY + 10;

    return { x, y };
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10

      const position = reactFlowInstance.screenToFlowPosition(
        getPositionToDrop(event)
      );

      const newNodeId = "Node_" + getUniqueId();

      const newNode = {
        id: newNodeId,
        type,
        position,
        data: {
          heading: "Send Message",
          label: `Auto generated message`,
        },
      };

      setNodes((nodes) => [...nodes, newNode]);
    },

    [reactFlowInstance]
  );

  // Start update node process when node gets clicked
  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  const handleBackClick = () => {
    setSelectedNode(null);
  };

  // Debounced function to reduce number of re-renders
  const handleUpdateNode = (newLabel) => {
    const selectedNodeId = selectedNode.id;

    //update the data of selected node
    const updatedNodes = nodes.map((node) => {
      if (node.id == selectedNodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            label: newLabel,
          },
        };
      }

      return node;
    });

    setNodes(updatedNodes);
  };

  const isConnectionValid = () => {
    // Note:
    // A valid connection has no more than 1 empty target
    // All the nodes have to be connected

    // get source and target nodes
    const sourceNodes = new Set();
    const targetNodes = new Set();

    edges.forEach((edge) => {
      sourceNodes.add(edge.source);
      targetNodes.add(edge.target);
    });

    const emptyTargetNodes = nodes.length - targetNodes.size;

    if (emptyTargetNodes > 1) {
      showAlert({
        message: "Invalid Connection! More than 1 empty targets.",
        type: "error",
      });
      return false;
    }

    // if any node is neither a sourceNode nor targetNode then the flow is not connected
    const isFlowDisnnected = nodes.some(
      (node) => !sourceNodes.has(node.id) && !targetNodes.has(node.id)
    );

    if (nodes.length > 1 && isFlowDisnnected) {
      showAlert({
        message: "Invalid Connection! Flow is disconnected.",
        type: "error",
      });
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (isConnectionValid()) {
      showAlert({ message: "Flow saved successfully", type: "success" });
    }
  };

  return (
    <div className="flow-builder-container">
      <Topbar onSave={handleSave} alertMessage={alertMessage} />
      {/*  */}
      <div className="flow-builder-panels">
        <ReactFlowProvider>
          <div className="flow-panel" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              onNodesChange={onNodesChange}
              edges={edges}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={handleNodeClick}
              proOptions={{ hideAttribution: true }}
              connectionLineType={ConnectionLineType.SmoothStep}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
          {/* contains updating teaxtarea and add node */}
          <Sidebar className="sidebar">
            {selectedNode ? (
              <UpdateNode
                selectedNode={selectedNode}
                onUpdateMessage={(value) => handleUpdateNode(value)}
                onBack={handleBackClick}
              />
            ) : (
              <div style={{ padding: "10px" }}>
                <AddNode />
              </div>
            )}
          </Sidebar>
        </ReactFlowProvider>
      </div>
    </div>
  );
}

export default FlowBuilder;
