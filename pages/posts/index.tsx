import { GetStaticProps } from "next";
import { getArchivePostAndPagenation } from "../../lib/api";
import { POST_TYPE_POSTS } from "../../lib/constants";
import { da } from "date-fns/locale";
import PostPreview from "../../components/post-preview";
import Pagenation from "../../components/pagenation";

export default function Archive({ posts, pageInfo, currentPage, preview }) {
  console.log({ posts, pageInfo, currentPage, preview });
  
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


export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const data = await getArchivePostAndPagenation(POST_TYPE_POSTS);
  const posts = data[POST_TYPE_POSTS].edges;
  const pageInfo = data[POST_TYPE_POSTS].pageInfo;
  const currentPage = 1; // /postsは1ページ

  return {
    props: {
      posts,
      pageInfo,
      currentPage,
      preview,
    },
    revalidate: 10,
  };
};