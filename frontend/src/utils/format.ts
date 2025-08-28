import { format, parseISO } from 'date-fns';

export function formatDate(dateString: string, formatStr = 'yyyy-MM-dd') {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr);
  } catch (error) {
    return dateString; // 파싱 실패 시 원본 문자열 반환
  }
}
