import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../components/layout";
import Head from "next/head";
import Container from "../../components/container";
import { getSearchResult } from "../../lib/api";
import PostPreview from "../../components/post-preview";

export default function SearchResult({posts, keyWord, preview}) {
  return (
    <Layout preview={preview}>
      <Head><title>検索結果：{keyWord}</title></Head>
      <Container>
        <section>
          <h2>検索結果：{keyWord}</h2>
          <div>
          {posts && posts.map(({ node }) => (
            <PostPreview
              key={node.slug}
              title={node.title}
              coverImage={node.featuredImage}
              date={node.date}
              author={node.author}
              slug={node.slug}
              excerpt={node.excerpt}
            />
            ))}
          </div>
        </section>
      </Container>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const keyWord = context.params.keyWord;
  const data = await getSearchResult(keyWord);
  return {
    props: {
      posts: data?.posts.edges,
      keyWord,
      preview: context.preview ?? false,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // ビルド時にはパスを生成しない
    fallback: 'blocking' // 新しいパスへのリクエストがあるとき、サーバーサイドでページを生成
  };
};
