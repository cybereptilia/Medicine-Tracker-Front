export default function Page({ title, children }) {
  return (
    <main className="container" style={{ fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>{title}</h1>
      {children}
    </main>
  );
}
