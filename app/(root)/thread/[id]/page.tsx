import ThreadCard from "@/components/cards/ThreadCard";
import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import Comment from "@/components/forms/Comment";

const Page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);

  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user?.id || ""}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          createdAt={thread.createdAt}
          comments={thread.children}
          community={thread.community}
        />
      </div>

      <div className="mt-7">
        <Comment
          threadId={thread.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10">
        {thread.children.map((comment: any) => (
          <ThreadCard
            key={comment._id}
            id={comment._id}
            currentUserId={user?.id || ""}
            parentId={comment.parentId}
            content={comment.text}
            author={comment.author}
            createdAt={comment.createdAt}
            comments={comment.children}
            community={comment.community}
            isComment={true}
          />
        ))}
      </div>
    </section>
  );
};

export default Page;
