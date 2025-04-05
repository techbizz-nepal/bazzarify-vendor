import { ReactNode } from "react";
import Breadcrumb from "@/modules/core/components/server/Breadcrumb";
import PageTitle from "@/modules/core/components/server/PageTitle";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  pageTitle: string;
  onAddClick?: () => void;
}

const PageContainer = ({ children, pageTitle, onAddClick }: Props) => {
  return (
    <>
      <Breadcrumb />
      <div className="flex justify-between items-center">
        <PageTitle
          title={pageTitle}
          className="text-2xl text-primary uppercase"
        />
        {onAddClick && <Button onClick={onAddClick}>Add</Button>}
      </div>
      {children}
    </>
  );
};

export default PageContainer;
