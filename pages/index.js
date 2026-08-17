import Head from "next/head";
import Link from "next/link";
import { db } from "../lib/firebase";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CATEGORIES = [
  { slug: "tech", label: "Технологии" },
  { slug: "business", label: "Бизнес" },
  { slug: "ai", label: "ИИ" },
  { slug: "news", label: "Новости" },
];

export default function Home({ posts }) {
  const [hero, ...rest] = posts;

  return (
    <>
      <Head>
        <title>Rusnet — новости IT и технологий</title>
      </Head>

      <Header />

      <div className="wrap">
        <div className="tagline">новости рунета, IT и технологий</div>

        <div className="category-filter">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`}>
              {c.label}
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="empty">Пока нет опубликованных новостей.</div>
        )}

        {hero && (
          <Link href={`/post/${hero.id}`} className="hero-card">
            {hero.image && <img src={hero.image} alt="" />}
            <div className="hero-card-body">
              <div className="post-category">{hero.category || "news"}</div>
              <div className="post-title">{hero.title}</div>
              <div className="post-meta">
                {hero.sourceName ? `Источник: ${hero.sourceName}` : "Rusnet"}
                {hero.publishedAt ? ` · ${formatDate(hero.publishedAt)}` : ""}
              </div>
            </div>
          </Link>
        )}

        <main className="feed">
          {rest.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`} className="post-card">
              <div className="post-category">{post.category || "news"}</div>
              <div className="post-title">{post.title}</div>
              <div className="post-meta">
                {post.sourceName ? `Источник: ${post.sourceName}` : "Rusnet"}
                {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ""}
              </div>
            </Link>
          ))}
        </main>
      </div>

      <Footer />
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
      image: data.image || null,
      sourceName: data.sourceName || null,
      publishedAt: data.publishedAt ? { _seconds: data.publishedAt.seconds } : null,
    };
  });

  return { props: { posts } };
          }
