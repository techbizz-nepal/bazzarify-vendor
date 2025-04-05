const PageTitle = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => <h1 className={className}>{title}</h1>;
export default PageTitle;
