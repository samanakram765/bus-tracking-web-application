const ErrorMessage = ({ error, visible }) => {
  if (!error || !visible) return null;

  return <span className="error-message">{error}</span>;
};

export default ErrorMessage;
