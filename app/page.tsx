import { Assistant } from "./assistant";
import { Analytics } from "@vercel/analytics/next";

export default function Home() {
  return (
    <>
      <Assistant />
      <Analytics />
    </>
  );
}
