# Creating Pages and Props (App Router)

This project uses the **Next.js App Router**. Pages are created by adding folders under `src/app` (optionally grouped under `(site)`) and placing a `page.tsx` file inside the route folder.

## 1) Create a new page

Example: create an About page under the public site layout:

- Create folder: `frontend/src/app/(site)/about/`
- Add file: `frontend/src/app/(site)/about/page.tsx`

`page.tsx` is required by the App Router. Other filenames like `index.page.tsx` are **not** picked up by Next.js.

## 2) Create a dynamic page (slug)

Dynamic segments use brackets, e.g. `[slug]`:

- Route file: `frontend/src/app/(site)/demo/[slug]/page.tsx`
- URLs: `/demo/alpha`, `/demo/boston`, `/demo/anything`

In this project, `params` is a Promise in Next 16, so we await it:

```tsx
export default async function DemoSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // ...
}
```

## 3) Create a “props/data” helper (like demo)

Instead of `getServerSideProps`, create a server helper and call it from the page:

- Helper: `frontend/src/app/(site)/demo/[slug]/demoData.ts`
- Page: `frontend/src/app/(site)/demo/[slug]/page.tsx`

Example helper:

```ts
export async function getDemoData(slug: string) {
  return {
    slug,
    title: `Demo for ${slug}`,
    description: `This data was loaded on the server for the slug "${slug}".`,
  };
}
```

Example page usage:

```tsx
import { getDemoData } from './demoData';

export default async function DemoSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const demoData = await getDemoData(slug);
  return (
    <main>
      <h1>{demoData.title}</h1>
      <p>{demoData.description}</p>
    </main>
  );
}
```

## 4) Keep the demo for onboarding

The demo route is kept at:

- `frontend/src/app/(site)/demo/[slug]/page.tsx`
- `frontend/src/app/(site)/demo/[slug]/demoData.ts`

Use it as a quick reference for new hires.
