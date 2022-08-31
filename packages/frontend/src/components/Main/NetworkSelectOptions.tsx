import networks from "../../../../contracts/networks.json";

export const NetworkSelectOptions: React.FC = () => {
  return (
    <>
      {Object.entries(networks).map(([key, { name }], i) => {
        return (
          <option key={i} value={key}>
            {name}
          </option>
        );
      })}
    </>
  );
};
