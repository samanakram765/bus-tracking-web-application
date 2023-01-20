const Message = ({ own, message, id }) => {
  return (
    <div id={id} className={own ? "message message-own" : "message"}>
      <p className={own ? "message-text message-text-own" : "message-text"}>
        {message}
      </p>
    </div>
  );
};

export default Message;
