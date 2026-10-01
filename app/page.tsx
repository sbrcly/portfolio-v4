import Footer from "@/components/footer/Footer";
import Frame from "@/components/frame/Frame";
import { CHAPTERS } from "@/components/frame/chapters";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Frame />
      <main>
        {CHAPTERS.map(({ id }) => (
          <section key={id} id={id} className={styles.chapter} />
        ))}
      </main>
      <Footer />
    </>
  );
}
