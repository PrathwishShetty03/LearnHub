const ProgressBar = ({ percentage = 0 }) => {
  const safePercentage = Math.min(100, Math.max(0, percentage));
  return (
    <div className="progress-container">
      <div className="progress-header">
        <span>Progress</span>
        <span>{safePercentage}% Completed</span>
      </div>
      <div className="progress-bar-bg">
        <div
          className="progress-bar-fill"
          style={{ width: `${safePercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
