import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const result = await fetchThreads({ pageNumber: 1, pageSize: 20 });
  const user = await currentUser();

  return (
    <main>
      <h1 className="text-2xl text-left head-text">Hakim</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result?.threads?.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result.threads.map(
              (thread) => (
                console.log("THREAD IMAGE", thread.image),
                (
                  <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={user?.id || ""}
                    parentId={thread.parentId}
                    image={thread.image}
                    content={thread.text}
                    author={thread.author}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                    community={thread.community}
                  />
                )
              )
            )}
          </>
        )}
      </section>
    </main>
  );
}
