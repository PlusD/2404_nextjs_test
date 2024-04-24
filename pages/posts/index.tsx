import Head from "next/head";
import Layout from "../../features/layout/layout";
import Container from "../../features/ui/container";
import ListOfPosts from "../../features/posts/list-posts";
import { GetStaticProps } from "next";
import { getAllPostsForHome } from "../../lib/api";

export default function PostsIndex({ posts, pageInfo, preview }) {
  return (
    <Layout preview={preview}>
      <Head>
        <title>一覧</title>
      </Head>
      <Container>
        <ListOfPosts posts={posts} />
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const response = await getAllPostsForHome(preview);
  const posts = response.edges;
  const pageInfo = response.pageInfo;


  return {
    props: { posts, pageInfo, preview },
    revalidate: 10,
  }
};