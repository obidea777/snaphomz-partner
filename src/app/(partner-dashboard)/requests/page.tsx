import PendingRequests from "components/dashboard/requests";

export default function RequestsPage() {
  return (
    <div className="flex mt-12   min-h-screen overflow-scroll ">
      <PendingRequests />
    </div>
  );
}
