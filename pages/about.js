import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Head>
        <title>О проекте — Rusnet</title>
      </Head>
      <Header />
      <div className="wrap static-page">
        <h1>О проекте</h1>
        <p>
          Rusnet — новостной портал о технологиях, IT-бизнесе и рунете.
          Мы собираем и коротко пересказываем главное из открытых источников,
          чтобы не нужно было читать десятки сайтов.
        </p>
        <p>
          Каждая новость, взятая из внешнего источника, помечена ссылкой на оригинал —
          если хочется прочитать материал полностью, переходите по ней.
        </p>
      </div>
      <Footer />
    </>
  );
            }
