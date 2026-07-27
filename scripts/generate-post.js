import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

// 환경변수에서 API 키를 가져옵니다.
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Error: GEMINI_API_KEY is not set.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function generatePost() {
  try {
    // 사용할 모델 선택 (최신 모델인 gemini-2.5-pro 또는 gemini-2.5-flash 권장)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 프롬프트 작성 (블로그 주제)
    const prompt = `
당신은 기술 블로그의 전문적인 작성자입니다.
오늘의 주제는 '최신 웹 개발 트렌드 2026'입니다.
이 주제로 독자들이 흥미를 느낄 만한 블로그 글을 Markdown 형식으로 작성해주세요.
제목은 '최신 웹 개발 트렌드 2026'로 하고, 내용은 서론, 본론, 결론으로 나누어주세요.
응답은 순수하게 블로그 내용(본문)만 반환해주세요.
`;

    console.log("Gemini API에 요청을 보내는 중...");
    const result = await model.generateContent(prompt);
    const content = result.response.text();

    // Astro Paper Frontmatter 양식에 맞게 데이터 구성
    const title = "최신 웹 개발 트렌드 2026";
    const date = new Date().toISOString();
    const description = "2026년 새롭게 떠오르는 최신 웹 개발 트렌드와 기술들을 알아봅니다.";

    const frontmatter = `---
author: "AI Writer"
pubDatetime: ${date}
title: "${title}"
featured: true
draft: false
tags:
  - web
  - trends
description: "${description}"
---

${content}
`;

    // 파일 저장 경로 (Astro Paper의 블로그 포스트 경로)
    const fileName = `web-dev-trends-${Date.now()}.md`;
    const dirPath = path.join(process.cwd(), "src", "content", "posts");
    const filePath = path.join(dirPath, fileName);

    // 디렉토리가 존재하지 않으면 생성합니다 (빈 폴더는 Git에 올라가지 않기 때문)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, frontmatter, "utf8");
    console.log(`성공: 블로그 포스트가 생성되었습니다! -> ${filePath}`);

  } catch (error) {
    console.error("Error generating post:", error);
    process.exit(1);
  }
}

generatePost();
