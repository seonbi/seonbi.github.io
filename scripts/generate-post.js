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
    // 사용할 모델 선택 (가장 강력한 최신 Pro 모델 사용)
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-pro",
      tools: [
        {
          googleSearch: {} // AI가 최신 뉴스를 검색할 수 있도록 허용!
        }
      ],
      generationConfig: { responseMimeType: "application/json" }
    });

    // 프롬프트 작성 (블로그 주제 및 JSON 출력 요청)
    const prompt = `
당신은 트렌드에 매우 민감한 테크/투자 블로그 전문 작성자입니다.
반드시 '실시간 구글 검색'을 활용하여 다음 작업을 수행해주세요.

최근 1주일 내의 글로벌 증시 흐름을 분석해 주세요. 특히 엔비디아, 메타, 구글 같은 빅테크 기업들의 주가에 영향을 미칠 수 있는 '잠재적 위협' 또는 '새로운 기회'로써, 월가 기관 투자자들이나 VC들이 최근 새롭게 지목하기 시작한 구체적인 '기술 키워드(특정 AI 모델명, 논문, 신규 프레임워크 등)' 1개를 찾아주세요.

뻔한 매크로 뉴스는 제외하고, 증시 전문가들이 주목하는 이 낯선 기술 키워드가 무엇이며 주식 시장 판도를 어떻게 바꿀 수 있는지 블로그 글로 작성해주세요.

응답은 다음 JSON 형식으로만 정확히 반환해주세요:
{
  "title": "[발굴한 키워드]를 포함한 독창적이고 매력적인 제목",
  "description": "이 기술이 왜 증시에 영향을 미치는지 요약한 1~2문장의 설명",
  "content": "서론, 본론(해당 기술의 특징과 주가/시장에 미칠 파급력), 결론으로 나누어진 Markdown 형식의 전체 블로그 본문"
}
`;

    console.log("Gemini API에 요청을 보내는 중...");
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    const title = parsed.title;
    const description = parsed.description;
    const content = parsed.content;
    const date = new Date().toISOString();

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
