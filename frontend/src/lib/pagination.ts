export const ITEMS_PER_PAGE = 3; // 한 페이지당 보여줄 게시물 수

/**
 * 페이지네이션 범위 계산 함수
 * @param currentPage 현재 페이지 번호 (1부터 시작)
 * @param totalPages 총 페이지 수
 * @param pageRangeDisplayed 화면에 보여줄 페이지 버튼의 최대 개수
 * @returns 페이지 번호 배열 (예: [1, 2, 3, 4, 5])
 */
export const calculatePaginationRange = (
  currentPage: number,
  totalPages: number,
  pageRangeDisplayed: number
): number[] => {
  const range: number[] = [];
  const half = Math.floor(pageRangeDisplayed / 2);

  let start = currentPage - half;
  let end = currentPage + half;

  if (start < 1) {
    start = 1;
    end = Math.min(totalPages, pageRangeDisplayed);
  }

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, totalPages - pageRangeDisplayed + 1);
  }

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  return range;
};
