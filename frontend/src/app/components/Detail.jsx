const Detail = ({ label, detail, margin, detailsClass, fontSize }) => {
  return (
    <div style={{ margin: margin }} className={detailsClass}>
      {label && (
        <label className="label" htmlFor="">
          {label}
        </label>
      )}
      <p style={{ fontSize: fontSize }}>{detail}</p>
    </div>
  );
};

export default Detail;
