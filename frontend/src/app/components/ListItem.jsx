import { Link } from "react-router-dom";

const ListItem = ({
  title,
  id,
  to,
  onClick,
  state,
  onDelete,
  onGenerateCard,
  onAndOffBoard = false,
  onAndOffBoardStatus,
}) => {
  return (
    <div className="item">
      <Link
        to={to + `/${id}`}
        state={state || {}}
        className="item-container d-flex align-items-center justify-content-between"
       
        id={id}
      >
        <li className="item-text">{title}</li>
        {onAndOffBoard && (
          <div
            style={{
              width: 15,
              height: 15,
              borderRadius: 15 / 2,
              backgroundColor:
                onAndOffBoardStatus === undefined ||
                onAndOffBoardStatus === false
                  ? "red"
                  : "green",
            }}
          ></div>
        )}
      </Link>
      <button className="btn btn-secondary btn-md" onClick={onClick}>
        Update
      </button>
      <button className="btn btn-danger btn-md" onClick={() => onDelete(id)}>
        Delete
      </button>
      {onGenerateCard && (
        <button className="btn btn-danger btn-md" onClick={onGenerateCard}>
          Card
        </button>
      )}
    </div>
  );
};

export default ListItem;
