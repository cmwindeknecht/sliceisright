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
        {items
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((item) => (
            <option key={item["id"]} value={item["name"]?.toString()}>
              {item["name"]} {item["menuItemCategory"] ? `--- ${item["menuItemCategory"]}` : ""}
            </option>
          ))}
      </select>
    </div>
  );
}
