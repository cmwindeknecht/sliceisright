export interface CategorySelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  categoryOptions: string[];
}

export default function CategorySelector({
  value,
  onChange,
  categoryOptions,
}: CategorySelectorProps) {
  return (
    <div>
      <label className="block mb-1 font-medium">Category</label>
      <select value={value} onChange={onChange} className="border p-2 rounded w-full">
        <option value="">-- Select Category --</option>
        {categoryOptions.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
