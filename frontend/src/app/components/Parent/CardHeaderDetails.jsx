const CardHeaderDetails = ({ cardDetails }) => {
  const { id, heading, Icon, tagline } = cardDetails;
  return (
    <div
      id={id}
      className="card-header-text col-md-3 col-sm-12 p-sm-3 d-flex justify-content-center align-items-center"
      data-aos="zoom-in"
      data-aos-delay="300"
    >
      <div className="d-flex">
        <Icon className="icon" />
        <div className="d-flex flex-column align-items-center ms-3">
          <span className="card-headings">{heading}</span>
          <span className="text-secondary">{tagline}</span>
        </div>
      </div>
    </div>
  );
};

export default CardHeaderDetails;
