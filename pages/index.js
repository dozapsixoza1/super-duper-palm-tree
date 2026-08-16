import Head from "next/head";
import Link from "next/link";
import { db } from "../lib/firebase";

export default function Home({ posts }) {
  return (
    <>
      <Head>
        <title>Rusnet — новости IT и технологий</title>
      </Head>
      <div className="wrap">
        <header className="header">
          <div className="logo">Rus<span>net</span></div>
          <div className="tagline">новости рунета, IT и технологий</div>
        </header>

        <main className="feed">
          {posts.length === 0 && (
            <div className="empty">Пока нет опубликованных новостей.</div>
          )}
          {posts.map((post, i) => (
            <Link key={post.id} href={`/post/${post.id}`} className="post-row">
              <div className="post-index">{String(i + 1).padStart(2, "0")}</div>
              <div>
                <div className="post-category">{post.category || "news"}</div>
                <div className="post-title">{post.title}</div>
                <div className="post-meta">
                  {post.sourceName ? `Источник: ${post.sourceName}` : "Rusnet"}
                  {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ""}
                </div>
              </div>
            </Link>
          ))}
        </main>
      </div>
    </>
  );
}

function formatDate(ts) {
  if (!ts) return "";
  const d = ts._seconds ? new Date(ts._seconds * 1000) : new Date(ts);
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
}

export async function getServerSideProps() {
  const snap = await db
    .collection("posts")
    .orderBy("publishedAt", "desc")
    .limit(30)
    .get();

  const posts = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title || "",
      category: data.category || "news",
      sourceName: data.sourceName || null,
      publishedAt: data.publishedAt ? { _seconds: data.publishedAt.seconds } : null,
    };
  });

  return { props: { posts } };
            }
