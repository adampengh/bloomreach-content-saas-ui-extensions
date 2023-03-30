import { remark } from 'remark';
import html from 'remark-html';
import path from 'path';
import fs from 'fs';
import * as matter from 'gray-matter';

export async function getMarkdown(file) {
  const fullPath = path.join(process.cwd(), file);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();


  // Combine the data with the id and contentHtml
  return {
    contentHtml
  };
}
