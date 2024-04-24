import { GetStaticPaths, GetStaticProps } from "next";
import { getArchivePath, getArchivePostAndPagenation } from "../../../lib/api";
import { POST_TYPE_POSTS } from "../../../lib/constants";
import PostPreview from "../../../components/post-preview";
import Pagenation from "../../../components/pagenation";
import { POST_PER_PAGE } from "../../../lib/constants";

export default function Archive({ posts, pageInfo, currentPage, preview }) {
  return (
    <section>
      <h2>一覧</h2>
      <div>
      {posts.map(({ node }) => (
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
      <Pagenation pageInfo={pageInfo} currentPage={currentPage} path={POST_TYPE_POSTS} />
    </section>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const page = context.params?.page ? parseInt(context.params.page as string, 10) : 1; // デフォルトを1に
  const offsetPagination = (page - 1) * POST_PER_PAGE; // ページ数に基づいてオフセットを計算

  const data = await getArchivePostAndPagenation(POST_TYPE_POSTS, offsetPagination);
  const posts = data[POST_TYPE_POSTS].edges;
  const pageInfo = data[POST_TYPE_POSTS].pageInfo.offsetPagination;

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

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await getArchivePath(POST_TYPE_POSTS);
  const totalPage = Math.ceil(data[POST_TYPE_POSTS].pageInfo.offsetPagination.total / POST_PER_PAGE);
  const sequence = Array.from({ length: totalPage }, (_, i) => i + 1);

  return {
    paths: sequence.map((val) => ({
      params: { page: val.toString() }, // パスをオブジェクト形式で定義
    })),
    fallback: true,
  };
};