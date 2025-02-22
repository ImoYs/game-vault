import "./loading.css";

export default function Loading() {
    return (
      <div className="loading-container">

        {/* <h2>⏳ Loading game details...</h2> */}
        <div className="loading" data-loading-text="Loading game details..."></div>
      </div>
    );
  }
  