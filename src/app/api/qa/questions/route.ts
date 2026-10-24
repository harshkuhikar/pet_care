import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const species = url.searchParams.get("species");
    const search = url.searchParams.get("search");
    const sort = url.searchParams.get("sort") || "newest"; // newest | answered | popular

    let questions = await db.getQuestions();
    const allAnswers = await db.getAllAnswersAdmin();

    // Attach answer counts
    const enriched = questions.map((q) => {
      const qAnswers = allAnswers.filter((a) => a.questionId === q.id && a.status === "active");
      const hasBestAnswer = qAnswers.some((a) => a.isBestAnswer);
      return {
        ...q,
        answersCount: qAnswers.length,
        hasBestAnswer,
      };
    });

    let filtered = enriched;

    if (category && category !== "all") {
      filtered = filtered.filter((q) => q.category.toLowerCase() === category.toLowerCase());
    }

    if (species && species !== "all") {
      filtered = filtered.filter((q) => q.petSpecies.toLowerCase() === species.toLowerCase());
    }

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (q) => q.title.toLowerCase().includes(s) || q.details.toLowerCase().includes(s)
      );
    }

    // Sort
    if (sort === "answered") {
      filtered.sort((a, b) => b.answersCount - a.answersCount);
    } else if (sort === "unanswered") {
      filtered = filtered.filter((q) => q.answersCount === 0);
    } else if (sort === "popular") {
      filtered.sort((a, b) => b.viewsCount - a.viewsCount);
    } else {
      // newest
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return NextResponse.json({ questions: filtered });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { authorId, authorName, authorAvatar, authorRole, title, details, category, petSpecies, imageUrl } = body;

    if (!title || !details || !authorId) {
      return NextResponse.json(
        { error: "Title, details, and author are required." },
        { status: 400 }
      );
    }

    // Basic sanitization
    const cleanTitle = title.trim().replace(/<[^>]*>?/gm, "");
    const cleanDetails = details.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

    const newQuestion = await db.createQuestion({
      authorId,
      authorName: authorName || "Pet Guardian",
      authorAvatar: authorAvatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      authorRole: authorRole || "member",
      title: cleanTitle,
      details: cleanDetails,
      category: category || "nutrition",
      petSpecies: petSpecies || "dog",
      imageUrl: imageUrl || undefined,
      status: "active",
    });

    return NextResponse.json({ success: true, question: newQuestion });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
