type SummaryCardProps = {
  title: string;
  value: string;
};

export default function SummaryCard({ title, value }: SummaryCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "16px",
        background: "#fff",
      }}
    >
      <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>{title}</p>
      <h2 style={{ marginTop: "8px" }}>{value}</h2>
    </div>
  );
}
