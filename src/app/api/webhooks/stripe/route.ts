import { db } from "@/db/drizzle"; // データベースを操作するための設定を読み込む
import { userSubscription } from "@/db/schema"; // ユーザーのサブスクリプション情報を管理するデータベースのテーブル
import { stripe } from "@/lib/stripe"; // StripeのAPIを操作するための設定
import { eq } from "drizzle-orm"; // データベースの検索条件を指定するための関数
import { headers } from "next/headers"; // リクエストのヘッダーを取得するための関数
import { NextResponse } from "next/server"; // Next.jsのレスポンスを作成するための関数

import Stripe from "stripe"; // Stripeの型情報を利用するためにインポート

export async function POST(req: Request) {
  // 受け取ったリクエストの内容をテキストとして取得
  const body = await req.text();

  // リクエストのヘッダー情報を取得
  const requestHeaders = await headers();
  // Stripeの署名を取得して検証に使用する
  const signature = requestHeaders.get("Stripe-Signature") as string;

  //Stripe の Webhook イベント を格納するための変数を宣言
  let event: Stripe.Event;

  try {
    // 受け取ったデータが正しいかStripeの署名を使って検証
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET! // 環境変数から秘密鍵を取得
    );
  } catch (error: unknown) {
    // エラーが発生した場合の処理
    if (error instanceof Error) {
      return new NextResponse(`エラーが発生しました: ${error.message}`, {
        status: 400,
      });
    }
    return new NextResponse("予期しないエラーが発生しました", {
      status: 400,
    });
  }

  // 受け取ったデータの中から購入情報を取得
  const session = event.data.object as Stripe.Checkout.Session;

  // ユーザーが決済を完了した場合の処理
  if (event.type === "checkout.session.completed") {
    // Stripeのサブスクリプション情報を取得
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // ユーザーIDが無い場合はエラーを返す
    if (!session?.metadata?.userId) {
      return new NextResponse("ユーザーIDが必要です", { status: 400 });
    }

    // サブスクリプションの情報をデータベースに保存
    await db.insert(userSubscription).values({
      userId: session.metadata.userId, // ユーザーのID
      stripeSubscriptionId: subscription.id, // サブスクリプションのID
      stripeCustomerId: subscription.customer as string, // Stripeの顧客ID
      stripePriceId: subscription.items.data[0].price.id, // 料金プランのID
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000), // 次の請求日を保存
    });
  }

  // 定期支払いが成功した場合の処理
  if (event.type === "invoice.payment_succeeded") {
    // サブスクリプション情報を取得
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // データベースのサブスクリプション情報を更新
    await db
      .update(userSubscription)
      .set({
        stripePriceId: subscription.items.data[0].price.id, // 新しい料金プランのIDを保存
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ), // 次回の請求日を更新
      })
      .where(eq(userSubscription.stripeSubscriptionId, subscription.id)); // 対象のサブスクリプションを特定して更新
  }

  // 正常に処理が完了したことを通知する
  return new NextResponse("処理が完了しました", { status: 200 });
}
