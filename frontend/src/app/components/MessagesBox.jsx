import Message from "./Message";
import Form from "./Form";
import SubmitButton from "./SubmitButton";
import Input from "./Input";
import Loader from "./Loader";

const MessagesBox = ({
  header,
  messages,
  user,
  dummy,
  sendMessage,
  validationSchema,
  isLoading,
}) => {
  console.log(header);
  return (
    <div className="col-8 message-container">
      <header className="message-header">
        <img
          src={
            header.image
              ? header.image
              : require("../assets/profile-avatar.jpg")
          }
          alt="profile"
          className="profile-image profile-rounded-image"
        />
        <div className="user-details">
          <h5 className="name">{header.name}</h5>
          <h6>{header.designation}</h6>
        </div>
      </header>
      <div className="line"></div>
      <div className="messages">
        {!header.id ? (
          <div className="flex-align-center messages">
            <h1>Select A Chat</h1>
          </div>
        ) : (
          <>
            {isLoading ? (
              <Loader width={200} height={"50vh"} />
            ) : (
              messages.map((message) => (
                <Message
                  message={message.message}
                  own={user.id === message.senderId}
                  id={message.id}
                />
              ))
            )}
          </>
        )}
        <div ref={dummy}></div>
      </div>
      <div className="send-message-container">
        <Form
          initialValues={{ message: "" }}
          onSubmit={sendMessage}
          validationSchema={validationSchema}
        >
          <Input
            inputClasses={"messages-input"}
            placeholder="Send Message"
            name="message"
            type="text"
            isFieldTouch={false}
          />
          <SubmitButton
            className="btn btn-primary btn-md"
            disabled={!header.id ? true : false}
            title="Send"
          />
        </Form>
      </div>
    </div>
  );
};

export default MessagesBox;
