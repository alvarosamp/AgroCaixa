import { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function SectionCard({
  title,
  description,
  children,
}: SectionCardProps) {
  return (
    <section className="panel">
      <div className="panel__header">
        <h2 className="panel__title">{title}</h2>
        {description ? <p className="panel__description">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
