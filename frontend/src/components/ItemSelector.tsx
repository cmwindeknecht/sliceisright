export interface SelectorProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  items: any[];
  defaultText: string;
}

export default function ItemSelector({
  label,
  value,
  onChange,
  items,
  defaultText,
}: SelectorProps) {
  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <select value={value} onChange={onChange} className="border p-2 rounded w-full">
        <option value={defaultText}>{defaultText}</option>
        {items.map((item) => (
          <option key={item["name"]} value={item["name"]?.toString()}>
            {item["name"]}
          </option>
        ))}
      </select>
    </div>
  );
}
