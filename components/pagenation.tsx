import { POST_PER_PAGE } from "../lib/constants";

export default function Pagenation({ pageInfo, currentPage, path }) {
  const totalPage = Math.ceil(pageInfo.total/POST_PER_PAGE);
  const sequence = Array.from({ length: totalPage }, (_, i) => i + 1);
  return (
    <div>
      {/* currentPageが1 */}
      {currentPage !== 1 && (
        <a href={`/${path}/page/${currentPage - 1}`}>前へ</a>
      )}
      {sequence.map(pageNum => {
        if (pageNum === currentPage) {
          return (
            <span key={`page${pageNum}`}>{pageNum}</span>
          );
        }
        return (
          <a href={`/${path}/page/${pageNum}`} key={`page${pageNum}`}>{pageNum}</a>
        );
      })}
      {totalPage > currentPage && (
        <a href={`/${path}/page/${currentPage + 1}`}>次へ</a>
      )}
    </div>
  );
}