/* eslint-disable react/prop-types */
import "./Sidebar.css"

function Sidebar({ children, className }) {
  return <div className={`sidebar ${className}`}>{children}</div>;
}

export default Sidebar;
