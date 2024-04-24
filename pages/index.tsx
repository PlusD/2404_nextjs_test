import Head from "next/head";
import { GetStaticProps } from "next";
import Container from "../features/ui/container";
import MoreStories from "../features/ui/more-stories";
import HeroPost from "../features/ui/hero-post";
import Intro from "../features/ui/intro";
import Layout from "../features/layout/layout";
import { getAllPostsForHome, getAllNewsForHome } from "../lib/api";
import { CMS_NAME } from "../lib/constants";

export default function Index({ allPosts: { edges }, news: { edges: newsEdgs }, preview }) {
  const heroPost = edges[0]?.node;
  const morePosts = edges.slice(1);

  const newslist = newsEdgs;

  return (
    <Layout preview={preview}>
      <Head>
        <title>{`Next.js Blog Example with ${CMS_NAME}`}</title>
      </Head>
      <Container>
        <Intro />
        {heroPost && (
          <HeroPost
            title={heroPost.title}
            coverImage={heroPost.featuredImage}
            date={heroPost.date}
            author={heroPost.author}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt}
          />
        )}
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        
        <h2>News</h2>
        {newslist?.length && <MoreStories posts={newslist} postType="news" />}
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome(preview);
  const news = await getAllNewsForHome(preview);

  return {
    props: { allPosts, news, preview },
    revalidate: 10,
  };
};
