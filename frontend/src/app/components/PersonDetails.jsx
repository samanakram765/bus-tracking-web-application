const PersonDetails = ({
  image,
  name,
  designation,
  handleClick,
  messagesNumber,
  isParent,
}) => {
  return (
    <>
      <div className="people-details" onClick={handleClick}>
        <img
          src={image ? image : require("../assets/profile-avatar.jpg")}
          className="profile-image profile-rounded-image"
          alt=""
        />
        <div className="user-details">
          <h5 className="name">{name}</h5>
          <h6>{designation ? designation : isParent ? "Parent" : "Driver"}</h6>
          <div className="line"></div>
        </div>
        {messagesNumber !== 0 && <span>{`(${messagesNumber})`}</span>}
      </div>
    </>
  );
};

export default PersonDetails;
