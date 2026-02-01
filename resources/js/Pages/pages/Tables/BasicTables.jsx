import PageBreadcrumb from "../../../Components/components/common/PageBreadCrumb";
import ComponentCard from "../../../Components/components/common/ComponentCard";
import PageMeta from "../../../Components/components/common/PageMeta";
import BasicTableOne from "../../../Components/components/tables/BasicTables/BasicTableOne";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Basic Tables" />
      <div className="space-y-6">
        <ComponentCard title="Basic Table 1">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
