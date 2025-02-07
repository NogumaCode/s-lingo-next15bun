"use server"; 

import { stripe } from "@/lib/stripe"; // Stripeのクライアントをインポート
import { absoluteUrl } from "@/lib/utils"; // 絶対URLを作成する関数
import { auth, currentUser } from "@clerk/nextjs/server"; // Clerkの認証機能を使用
import { getUserSubscription } from "@/db/queries"; // ユーザーのサブスクリプション情報を取得する関数

// 購入後のリダイレクト先URLを設定
const returnUrl = absoluteUrl("/shop");

/**
 * ユーザーのStripe決済URLを作成する
 * - 既存のサブスクリプションがある場合、Stripeの「請求管理ページ」へリダイレクト
 * - 新規サブスクリプションの場合、Stripeの「支払いページ」を作成
 */
export const createStripeUrl = async () => {
  // 現在のユーザー情報を取得
  const { userId } = await auth();
  const user = await currentUser();

  // 認証されていない場合はエラーをスロー
  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  // ユーザーのサブスクリプション情報を取得
  const userSubscription = await getUserSubscription();

  // すでにサブスクリプションを持っている場合は、Stripeの「請求管理ページ」へリダイレクト
  if (userSubscription && userSubscription.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSubscription.stripeCustomerId, // StripeのカスタマーID
      return_url: returnUrl, // 決済完了後のリダイレクト先
    });

    return { data: stripeSession.url }; // Stripeの請求管理ページのURLを返す
  }

  // 新規ユーザーの場合、Stripeの「決済ページ」を作成
  const stripeSession = await stripe.checkout.sessions.create({
    mode: "subscription", // 定期購入（サブスクリプション）モード
    payment_method_types: ["card"], // クレジットカードでの支払いを許可
    customer_email: user.emailAddresses[0].emailAddress, // ユーザーのメールアドレスをStripeに渡す
    line_items: [
      {
        quantity: 1, // 1つのプランを購入
        price_data: {
          currency: "JPY", // 日本円
          product_data: {
            name: "Lingo Pro", // 商品名
            description: "Unlimited hearts", // 説明（例：無制限のハート）
          },
          unit_amount: 2000, // 月額2000円
          recurring: {
            interval: "month", // 毎月のサブスクリプション
          },
        },
      },
    ],
    metadata: {
      userId, // ユーザーIDをメタデータに保存（Webhookで使用可能）
    },
    success_url: returnUrl, // 決済成功後のリダイレクト先
    cancel_url: returnUrl, // 決済キャンセル時のリダイレクト先
  });

  return { data: stripeSession.url }; // Stripeの支払いページのURLを返す
};
