import Head from "next/head";
import Link from "next/link";
import { db } from "../../lib/firebase";

export default function Post({ post }) {
  if (!post) {
    return (
      <div className="wrap post-detail">
        <p>Новость не найдена.</p>
        <Link href="/" className="back-link">← на главную</Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{post.title} — Rusnet</title>
      </Head>
      <div className="wrap post-detail">
        <Link href="/" className="back-link">← на главную</Link>

        <div className="post-category">{post.category || "news"}</div>
        <h1>{post.title}</h1>
        <div className="post-meta">
          {post.sourceName ? `По материалам: ${post.sourceName}` : "Rusnet"}
        </div>

        {post.image && <img src={post.image} alt="" className="post-image" />}

        <div className="post-body">
          {post.body.split("\n").filter(Boolean).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {post.sourceUrl && (
          <div className="source-box">
            Материал подготовлен на основе публикации {post.sourceName || "источника"}.{" "}
            <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer">
              Читать оригинал →
            </a>
          </div>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const doc = await db.collection("posts").doc(params.id).get();
  if (!doc.exists) return { props: { post: null } };

  const data = doc.data();
  return {
    props: {
      post: {
        id: doc.id,
        title: data.title || "",
        body: data.body || "",
        category: data.category || "news",
        image: data.image || null,
        sourceName: data.sourceName || null,
        sourceUrl: data.sourceUrl || null,
      },
    },
  };
    }
