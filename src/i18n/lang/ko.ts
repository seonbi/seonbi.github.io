import type { UIStrings } from "../types";

export default {
  nav: {
    home: "홈",
    posts: "게시물",
    tags: "태그",
    about: "소개",
    archives: "기록",
    search: "검색",
  },
  post: {
    publishedAt: "작성일",
    updatedAt: "수정일",
    sharePostIntro: "이 글 공유하기:",
    sharePostOn: "{{platform}}에 이 글 공유하기",
    sharePostViaEmail: "이메일로 이 글 공유하기",
    tagLabel: "태그",
    backToTop: "맨 위로",
    goBack: "뒤로 가기",
    editPage: "페이지 수정",
    previousPost: "이전 글",
    nextPost: "다음 글",
  },
  pagination: {
    prev: "이전",
    next: "다음",
    page: "페이지",
  },
  home: {
    socialLinks: "소셜 링크",
    featured: "주요 글",
    recentPosts: "최근 게시물",
    allPosts: "모든 게시물",
  },
  footer: {
    copyright: "저작권",
    allRightsReserved: "모든 권리 보유.",
  },
  pages: {
    tagTitle: "태그",
    tagDesc: "해당 태그가 포함된 모든 글",

    tagsTitle: "태그",
    tagsDesc: "블로그에 사용된 모든 태그",

    postsTitle: "게시물",
    postsDesc: "작성된 모든 게시물",

    archivesTitle: "기록",
    archivesDesc: "기록된 모든 게시물",

    searchTitle: "검색",
    searchDesc: "게시물 검색...",
  },
  a11y: {
    skipToContent: "본문으로 건너뛰기",
    openMenu: "메뉴 열기",
    closeMenu: "메뉴 닫기",
    toggleTheme: "테마 변경",
    searchPlaceholder: "게시물 검색...",
    noResults: "결과를 찾을 수 없습니다",
    goToPreviousPage: "이전 페이지로 가기",
    goToNextPage: "다음 페이지로 가기",
  },
  notFound: {
    title: "404 찾을 수 없음",
    message: "페이지를 찾을 수 없습니다",
    goHome: "홈으로 돌아가기",
  },
} satisfies UIStrings;
