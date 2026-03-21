import Breadcrumb from "@/modules/core/components/server/Breadcrumb";
import PageTitle from "@/modules/core/components/server/PageTitle";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  pageTitle: string;
  actionSlot?: ReactNode;
}

const PageContainer = ({ children, pageTitle, actionSlot }: Props) => {
  return (
    <>
      <Breadcrumb />
      <div className="flex items-center justify-between">
        <PageTitle
          title={pageTitle}
          className="text-primary text-lg font-semibold uppercase"
        />
        {actionSlot}
      </div>
      {children}
    </>
  );
};

export default PageContainer;
