import Head from "next/head";
import Link from "next/link";
import { db } from "../../lib/firebase";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const LABELS = {
  tech: "Технологии",
  business: "Бизнес",
  ai: "ИИ",
  news: "Новости",
};

export default function Category({ posts, slug }) {
  const label = LABELS[slug] || slug;

  return (
    <>
      <Head>
        <title>{label} — Rusnet</title>
      </Head>
      <Header />
      <div className="wrap">
        <div className="tagline">раздел: {label}</div>

        {posts.length === 0 && (
          <div className="empty">В этой категории пока нет новостей.</div>
        )}

        <main className="feed" style={{ marginTop: "20px" }}>
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`} className="post-card">
              <div className="post-category">{post.category || "news"}</div>
              <div className="post-title">{post.title}</div>
              <div className="post-meta">
                {post.sourceName ? `Источник: ${post.sourceName}` : "Rusnet"}
              </div>
            </Link>
          ))}
        </main>
      </div>
      <Footer />
    </>
  );
}

export async function getServerSideProps({ params }) {
  const slug = params.slug;

  const snap = await db
    .collection("posts")
    .where("category", "==", slug)
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
    };
  });

  return { props: { posts, slug } };
    }
