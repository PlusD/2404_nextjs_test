import { GetStaticPaths, GetStaticProps } from "next";
import { getArchivePath, getArchivePostAndPagenation } from "../../../lib/api";
import { POST_TYPE_NEWS } from "../../../lib/constants";
import PostPreview from "../../../components/post-preview";
import Pagenation from "../../../components/pagenation";
import { POST_PER_PAGE } from "../../../lib/constants";
import Layout from "../../../components/layout";
import Head from "next/head";
import Container from "../../../components/container";

export default function Archive({ posts, pageInfo, currentPage, preview }) {
  return (
    <Layout preview={preview}>
      <Head>
        <title>一覧ページ</title>
      </Head>
      <Container>
        <section>
          <h2>一覧</h2>
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
          <Pagenation pageInfo={pageInfo} currentPage={currentPage} path={POST_TYPE_NEWS} />
        </section>
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const page = context.params?.page ? parseInt(context.params.page as string, 10) : 1; // デフォルトを1に
  const offsetPagination = (page - 1) * POST_PER_PAGE; // ページ数に基づいてオフセットを計算

  const data = await getArchivePostAndPagenation(POST_TYPE_NEWS, offsetPagination);
  const posts = data[POST_TYPE_NEWS].edges;
  const pageInfo = data[POST_TYPE_NEWS].pageInfo.offsetPagination;

  return {
    props: {
      posts,
      pageInfo,
      currentPage: page,
      preview: context.preview ?? false,
    },
    revalidate: 10,
  };
};

// export const getStaticPaths: GetStaticPaths = async () => {
//   const data = await getArchivePath(POST_TYPE_NEWS);
//   const totalPage = Math.ceil(data[POST_TYPE_NEWS].pageInfo.offsetPagination.total / POST_PER_PAGE);
//   const sequence = Array.from({ length: totalPage }, (_, i) => i + 1);

//   return {
//     paths: sequence.map((val) => ({
//       params: { page: val.toString() }, // パスをオブジェクト形式で定義
//     })),
//     fallback: true,
//   };
// };
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // ビルド時にはパスを生成しない
    fallback: 'blocking' // 新しいパスへのリクエストがあるとき、サーバーサイドでページを生成
  };
};
