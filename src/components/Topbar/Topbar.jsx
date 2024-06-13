/* eslint-disable react/prop-types */
import "./Topbar.css";

function Topbar({ alertMessage, onSave }) {
  return (
    <div className="topbar">
      <div style={{ flex: 1 }}>
        <img src="/logo.png" alt="Flow logo" height={30} />
      </div>
      {/* Contains Alert Message */}
      <div style={{ flex: 3, textAlign: "center" }}>
        {alertMessage && (
          <span className={`alert ${alertMessage.type}`}>
            {alertMessage.message}
          </span>
        )}
      </div>
      {/* Save Button */}
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
        <button className="save-button" onClick={onSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Topbar;
