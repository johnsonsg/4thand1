type DemoData = {
  slug: string;
  title: string;
  description: string;
};

export async function getDemoData(slug: string): Promise<DemoData> {
  // Simulate a server-side fetch or DB call.
  return {
    slug,
    title: `Demo for ${slug}`,
    description: `This data was loaded on the server for the slug "${slug}".`,
  };
}
