import { ReactNode } from "react";
import Breadcrumb from "@/modules/core/components/server/Breadcrumb";
import PageTitle from "@/modules/core/components/server/PageTitle";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  pageTitle: string;
}

const PageContainer = ({ children, pageTitle }: Props) => {
  return (
    <>
      <Breadcrumb />
      <div className="flex justify-between items-center">
        <PageTitle
          title={pageTitle}
          className="text-lg font-semibold text-primary uppercase"
        />
      </div>
      {children}
    </>
  );
};

export default PageContainer;
