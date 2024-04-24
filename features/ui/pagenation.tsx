
export default function Pagenation({ pageInfo }) {
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages
  return (
    <div>
      {!isFirstPage && <a href={`/posts/page/${currentPage - 1}`}>前へ</a>}
      <span>{currentPage}</span> / <span>{totalPages}</span>
      {!isLastPage && <a href={`/posts/page/${currentPage + 1}`}>次へ</a>}
    </div>
  );
}