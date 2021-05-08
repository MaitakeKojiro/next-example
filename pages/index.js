import Head from 'next/head'
import Link from 'next/link'
import Date from '../components/date'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>舞茸小次郎です。Next.js勉強中です。</p>
        <p>
          (このサイトを見て勉強しています。{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

// getStaticPorpsを使うことで外部からデータを取得できる。
// getStaticPropsは毎回のリクエストごとに実行される
export async function getStaticProps() {
  // ファイルシステムや API、 DB などから外部データを取得する
  const allPostsData = getSortedPostsData()
  return {
    // `props`キーに対応する値が `Home` コンポーネントに渡される
    props: {
      allPostsData
    }
  }
}