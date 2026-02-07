import { getDemoData } from './demoData';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function DemoSlugPage({ params }: PageProps) {
  const resolvedParams = await params;
  const demoData = await getDemoData(resolvedParams.slug);
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Dynamic Demo Page</h1>
      <h2 style={{ marginTop: "1rem" }}>Slug: {resolvedParams.slug}</h2>
      <h3 style={{ marginTop: "1rem" }}>{demoData.title}</h3>
      <p>{demoData.description}</p>
      <pre
        style={{
          marginTop: "1rem",
          padding: "1rem",
          background: "#111",
          color: "#fff",
          borderRadius: "8px",
        }}
      >
        {JSON.stringify({ params: resolvedParams, demoData }, null, 2)}
      </pre>
    </main>
  );
}
