interface ISectionTitle {
  label: string;
  className?: string;
  helpText?: string;
}

export default function SectionTitle({
  label,
  className,
  helpText,
}: ISectionTitle) {
  return (
    <div className={className}>
      <div className="flex flex-col">
        <p className="text-3xl font-bold">{label}</p>
        {helpText && (
          <small className="text-muted-foreground">{helpText}</small>
        )}
      </div>
    </div>
  );
}
