import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";
import path from "path";

// 환경변수에서 API 키를 가져옵니다.
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Error: GEMINI_API_KEY is not set.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function generatePost() {
  try {
    const schema = {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "단편 소설의 흥미를 유발하는 창의적이고 매력적인 제목"
        },
        slug: {
          type: Type.STRING,
          description: "영문 소문자와 하이픈(-)만으로 구성된 짧고 간결한 URL용 슬러그 (예: ai-story-123)"
        },
        description: {
          type: Type.STRING,
          description: "소설의 분위기나 핵심 시놉시스를 요약한 1~2문장의 설명 (SEO 메타 디스크립션 용도)"
        },
        content: {
          type: Type.STRING,
          description: "흥미진진한 단편 소설 본문 및 교훈. Markdown 문법(h2, h3, 볼드체, 인용구 등)을 적극 활용하여 가독성 있게 작성할 것."
        },
        tags: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          },
          description: "소설의 장르나 핵심 소재를 나타내는 3~5개의 태그 (예: SF, 판타지, 스릴러, 반전 등)"
        }
      },
      required: ["title", "slug", "description", "content", "tags"]
    };

    const prompt = `
당신은 매일 밤 새로운 이야기를 들려주는 현대판 세헤라자데입니다.
반드시 '실시간 구글 검색'을 활용하여 오늘 하루 전 세계에서 일어난 화제의 뉴스나 트렌드 키워드 중 하나를 무작위로 선택하세요. (예: 새로운 과학 발견, 기이한 사건, 화제의 인물 등)

그리고 그 키워드에서 영감을 받아 3분 정도면 읽을 수 있는 흥미진진한 단편 소설(SF, 판타지, 스릴러, 동화 등 장르 무관)을 창작해 주세요.

작성 가이드라인:
- 서론: 선택한 오늘 하루의 실제 '키워드(모티브)'가 무엇인지 아주 짧게 언급하며 시작하세요.
- 본문(content): Markdown 문법(h2, h3, 볼드체, 인용구 등)을 활용해 몰입감 있는 소설을 작성하세요.
- 결론: 이야기의 여운이 남는 철학적인 한 줄 평이나 교훈을 덧붙여 주세요.
`;

    console.log("Gemini API에 요청을 보내는 중...");
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        tools: [{ googleSearch: {} }]
      }
    });
    const responseText = response.text;
    
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Error: 응답 데이터를 JSON으로 파싱하는 데 실패했습니다.", parseError);
      console.error("원본 응답:\n", responseText);
      process.exit(1);
    }

    const { title, slug, description, content, tags } = parsed;

    const date = new Date().toISOString();

    const tagsYaml = tags.map(tag => `  - ${tag}`).join("\n");

    const frontmatter = `---
author: "AI Writer"
pubDatetime: ${date}
title: "${title}"
featured: true
draft: false
tags:
${tagsYaml}
description: "${description}"
---

${content}
`;

    // 파일 저장 경로 (SEO에 친화적인 슬러그 사용, 중복 방지를 위해 날짜 추가)
    const timestamp = Date.now();
    const safeSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const fileName = `${safeSlug}-${timestamp}.md`;
    
    const dirPath = path.join(process.cwd(), "src", "content", "posts");
    const filePath = path.join(dirPath, fileName);

    // 디렉토리가 존재하지 않으면 생성합니다 (빈 폴더는 Git에 올라가지 않기 때문)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, frontmatter, "utf8");
    console.log(`성공: 블로그 포스트가 생성되었습니다! -> ${filePath}`);

  } catch (error) {
    console.error("Error generating post API 요청 중 오류가 발생했습니다:", error);
    process.exit(1);
  }
}

generatePost();
