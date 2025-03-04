import Sidebar from "@/components/Sidebar";

export default function SidebarLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex">
        <Sidebar home="/" />
        <nav></nav>
        <div className="flex justify-center w-full">{children}</div>
      </div>
    </section>
  );
}
