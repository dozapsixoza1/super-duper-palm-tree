import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Contact() {
  return (
    <>
      <Head>
        <title>Контакты — Rusnet</title>
      </Head>
      <Header />
      <div className="wrap static-page">
        <h1>Контакты</h1>
        <p>Пишите по любым вопросам — реклама, сотрудничество, ошибки на сайте, свои новости.</p>

        <div className="contact-list">
          <div className="contact-item">
            <h4>Telegram-канал</h4>
            <a href="https://t.me/rusnet0" target="_blank" rel="noopener noreferrer">
              @rusnet0
            </a>
          </div>

          <div className="contact-item">
            <h4>Новости / реклама / сотрудничество</h4>
            <a href="https://t.me/rusnetsupport" target="_blank" rel="noopener noreferrer">
              @rusnetsupport
            </a>
          </div>

          <div className="contact-item">
            <h4>Почта</h4>
            <a href="mailto:hello@rusnet.example">hello@rusnet.example</a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
    }
