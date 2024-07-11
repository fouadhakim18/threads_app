"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { create } from "domain";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  try {
    connectToDB();
    const createThread = await Thread.create({
      text,
      author,
      community: null,
    });

    // Update User Model

    await User.findByIdAndUpdate(author, {
      $push: { threads: createThread._id },
    });

    revalidatePath(path);
  } catch (error) {
    throw new Error("Failed to create thread : " + error);
  }
}

export async function fetchThreads({ pageNumber = 1, pageSize = 20 }) {
  connectToDB();

  // Calculate the number of threads to skip
  const skip = (pageNumber - 1) * pageSize;

  // Fetch Top level threads (with no parents)
  const threadsQuery = Thread.find({
    parentId: { $in: [null, undefined] },
  })
    .sort({
      createdAt: "desc",
    })
    .skip(skip)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalThreadsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const threads = await threadsQuery.exec();

  const isNext = skip + pageSize < totalThreadsCount;

  return { threads, isNext };
}

export async function fetchThreadById(id: string) {
  connectToDB();
  try {
    //TODO : Populate Community
    const thread = await Thread.findById({ _id: id })
      .populate({
        // author of the thread
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        // comments
        path: "children",
        populate: [
          {
            // author of the comment
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            // replies to a comment
            path: "children",
            model: Thread,
            populate: {
              // author of a comment reply
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (error) {
    throw new Error("Failed to fetch thread : " + error);
  }
}

export async function addComment(
  threadId: string,
  text: string,
  authorId: string,
  path: string
) {
  connectToDB();
  try {
    const originalThread = await await Thread.findById(threadId);
    if (!originalThread) throw new Error("Thread not found");
    const comment = new Thread({
      text: text,
      author: authorId,
      parentId: threadId,
    });

    const savedComment = await comment.save();

    originalThread.children.push(savedComment._id);

    await originalThread.save();
    revalidatePath(path);
  } catch (error) {
    throw new Error("Failed to add comment : " + error);
  }
}
