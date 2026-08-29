import AdminResourcePage from "./AdminResourcePage";

export default function Recruiters() {
  return (
    <AdminResourcePage
      title="Recruiters"
      endpoint="/admin/recruiters"
      collectionKey="recruiters"
      columns={[
        {
          key: "name",
          label: "Name",
        },
        {
          key: "email",
          label: "Email",
        },
        {
          key: "isVerified",
          label: "Verified",
          render: (item) =>
            item.isVerified ? "Yes" : "No",
        },
        {
          key: "isActive",
          label: "Active",
          render: (item) =>
            item.isActive ? "Yes" : "No",
        },
      ]}
    />
  );
}