import { NextResponse } from "next/server";
import { getDbConnectionStatus, connectToDatabase } from "@/lib/server/mongodb";
import {
  AccountModel,
  UserModel,
  QuestionModel,
  AnswerModel,
  UnlockModel,
  AuditLogModel,
  ContactMessageModel,
  NewsletterSubscriberModel,
  PetRecordModel,
  OrderModel,
} from "@/lib/server/models";

export async function GET() {
  try {
    const status = await getDbConnectionStatus();

    if (!status.connected) {
      return NextResponse.json({
        connected: false,
        error: status.error || "Cannot reach MongoDB Atlas cluster",
      });
    }

    await connectToDatabase();

    const [
      accountsCount,
      usersCount,
      questionsCount,
      answersCount,
      unlocksCount,
      logsCount,
      contactsCount,
      newsletterCount,
      petsCount,
      ordersCount,
    ] = await Promise.all([
      AccountModel.countDocuments(),
      UserModel.countDocuments(),
      QuestionModel.countDocuments(),
      AnswerModel.countDocuments(),
      UnlockModel.countDocuments(),
      AuditLogModel.countDocuments(),
      ContactMessageModel.countDocuments(),
      NewsletterSubscriberModel.countDocuments(),
      PetRecordModel.countDocuments(),
      OrderModel.countDocuments(),
    ]);

    return NextResponse.json({
      connected: true,
      database: status.dbName,
      host: status.host,
      latencyMs: status.latencyMs,
      readyState: status.readyState,
      stats: {
        accounts: accountsCount,
        users: usersCount,
        questions: questionsCount,
        answers: answersCount,
        unlocks: unlocksCount,
        auditLogs: logsCount,
        contactMessages: contactsCount,
        newsletterSubscribers: newsletterCount,
        pets: petsCount,
        orders: ordersCount,
      },
      tools: {
        webUi: "https://cloud.mongodb.com/",
        desktopTool: "MongoDB Compass",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { connected: false, error: err.message },
      { status: 500 }
    );
  }
}
