export const CategoryDetailField = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex items-center space-x-3">
    <div className="uppercase" id="column">
      {label}
    </div>
    <div>:</div>
    <div>{value}</div>
  </div>
);

//TODO add link if child has another children
export const CategoryChildrenDetailField = ({
  label,
  value,
}: {
  label: string;
  value: string;
  hasChildren?: boolean;
}) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="uppercase" id="column">
        {label}
      </div>
      <div>:</div>
      <div>{value}</div>
    </div>
  );
};
