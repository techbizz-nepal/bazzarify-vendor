import Breadcrumb from "@/modules/core/components/server/Breadcrumb";
import PageTitle from "@/modules/core/components/server/PageTitle";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  pageTitle: string;
}

const PageContainer = ({ children, pageTitle }: Props) => {
  return (
    <>
      <Breadcrumb />
      <div className="flex items-center justify-between">
        <PageTitle
          title={pageTitle}
          className="text-primary text-lg font-semibold uppercase"
        />
      </div>
      {children}
    </>
  );
};

export default PageContainer;
