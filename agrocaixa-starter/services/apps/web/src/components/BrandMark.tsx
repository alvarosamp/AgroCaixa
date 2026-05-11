import Link from "next/link";

type BrandMarkProps = {
  compact?: boolean;
  href?: string;
  tone?: "dark" | "light";
};

export default function BrandMark({
  compact = false,
  href = "/",
  tone = "dark",
}: BrandMarkProps) {
  return (
    <Link
      href={href}
      className={`brand-mark brand-mark--${tone} ${
        compact ? "brand-mark--compact" : ""
      }`}
    >
      <span className="brand-mark__glyph" aria-hidden="true">
        <span className="brand-mark__glyph-core" />
        <span className="brand-mark__glyph-line" />
      </span>

      <span className="brand-mark__copy">
        <strong>AgroCaixa</strong>
        <small>Financeiro simples para o campo</small>
      </span>
    </Link>
  );
}
