type SummaryCardProps = {
  title: string;
  value: string;
  hint?: string;
  tone?: "default" | "positive" | "negative" | "accent";
};

export default function SummaryCard({
  title,
  value,
  hint,
  tone = "default",
}: SummaryCardProps) {
  return (
    <article className={`summary-card summary-card--${tone}`}>
      <p className="summary-card__title">{title}</p>
      <strong className="summary-card__value">{value}</strong>
      {hint ? <span className="summary-card__hint">{hint}</span> : null}
    </article>
  );
}
