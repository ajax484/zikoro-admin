import EditArticle from "@/components/article/EditArticle";

export default function Page({
  params: { articleId },
}: {
  params: { articleId: number };
}) {
    return <EditArticle articleId= {articleId} />
}