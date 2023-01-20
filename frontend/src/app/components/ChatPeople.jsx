import PersonDetails from "./PersonDetails";

const ChatPeople = ({ persons, handlePersonClick, messagesNumber = [] }) => {
  return (
    <div className="col-3 people-container">
      {persons.map((person) => {
        person.messagesCount = 0;
        person.messageNumberId = "";
        messagesNumber.forEach((messages) => {
          if (messages.senderId === person.id) {
            person.messagesCount = messages.data.length;
            person.messageNumberId = messages.id;
          }
        });

        console.log("Chat people : ", person);
        return (
          <PersonDetails
            image={person.image}
            name={
              person.fullName
                ? `${person.fullName}`
                : `${person.firstname} ${person.lastname}`
            }
            messagesNumber={person.messagesCount}
            designation={person.designation}
            isParent={person.isParent}
            handleClick={() => handlePersonClick(person)}
          />
        );
      })}
    </div>
  );
};

export default ChatPeople;
