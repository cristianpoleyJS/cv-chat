import { Assistant } from "./assistant";
import Analytics from '@vercel/analytics/astro'

export default function Home() {
  return (
    <>
      <Assistant />
      <Analytics />
    </>
  );
}
