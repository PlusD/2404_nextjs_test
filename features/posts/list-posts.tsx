export default function ListOfPosts({ posts }) {
  console.log({ posts });
  
  return (
    <section>
      <h2>投稿一覧({posts?.length}件)</h2>
      <div>
        {
          posts?.map(item => (
            <div>{item.node.title}</div>
          ))
        }
      </div>
    </section>
  );
}

