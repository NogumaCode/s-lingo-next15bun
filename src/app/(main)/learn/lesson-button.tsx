"use client";

import { Check, Crown, Star } from "lucide-react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import { cn } from "@/lib/utils";
import "react-circular-progressbar/dist/styles.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  id: number;
  index: number;
  totalCount: number;
  locked?: boolean;
  current?: boolean;
  percentage: number;
};

export const LessonButton = ({
  id,
  index,
  totalCount,
  locked,
  current,
  percentage,
}: Props) => {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  let indentationLevel;

  if (cycleIndex <= 2) {
    indentationLevel = cycleIndex;
  } else if (cycleIndex <= 4) {
    indentationLevel = 4 - cycleIndex;
  } else if (cycleIndex <= 6) {
    indentationLevel = 4 - cycleIndex;
  } else {
    indentationLevel = cycleIndex - 8;
  }

  const rightPosition = indentationLevel * 40;

  const isFirst = index === 0;
  const isLast = index === totalCount;
  const isCompleted = !current && !locked;

  const Icon = isCompleted ? Check : isLast ? Crown : Star;

  const href = isCompleted ? `/lesson/${id}` : "/lesson";

  // 最終レッスンかどうか判定
  const isFinalLesson = index === totalCount;

  return (
    <div
      className="relative"
      style={{
        right: `${rightPosition}px`,
        marginTop: isFirst && !isCompleted ? 60 : 24,
      }}
    >
      {isFinalLesson ? (
        // Coming Soonバージョン（最終レッスン）
        <div className="h-[72px] w-[72px] relative">
          <div className="absolute -top-6 -left-2.5 leading-4 px-3 py-1.5 border-2 font-bold text-gray-400 bg-white rounded-xl animate-bounce tracking-wide z-10">
            Coming Soon
            <div className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-gray-400 transform -translate-x-1/2" />
          </div>
          <div className="h-[72px] w-[72px] flex items-center justify-center bg-gray-300 rounded-full">
            <Star className="w-8 h-8 text-gray-500" />
          </div>
        </div>
      ) : (
        // 通常レッスン
        <Link
          href={href}
          aria-disabled={locked}
          style={{ pointerEvents: locked ? "none" : "auto" }}
        >
          {current ? (
            <div className="h-[102px] w-[102px] relative">
              <div className="absolute -top-6 left-2.5 px-3 py-2.5 border-2 font-bold uppercase text-green-500 bg-white rounded-xl animate-bounce tracking-wide z-10">
                Start
                <div className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-green-500 transform -translate-x-1/2" />
              </div>
              <CircularProgressbarWithChildren
                value={Number.isNaN(percentage) ? 0 : percentage}
                styles={{
                  path: { stroke: "#4ade80" },
                  trail: { stroke: "#e5e7eb" },
                }}
              >
                <Button
                  size="rounded"
                  variant={locked ? "locked" : "secondary"}
                  className="h-[70px] w-[70px] border-b-8"
                >
                  <Icon
                    className={cn(
                      "w-10 h-10",
                      locked
                        ? " fill-neutral-400 text-neutral-400 stroke-neutral-400"
                        : "fill-primary-foreground text-primary-foreground",
                      isCompleted && "fill-none stroke-[4]",
                      Icon === Crown && "fill-current"
                    )}
                    style={{
                      height: "2rem",
                      width: "2rem",
                      ...((Icon === Crown || Icon === Star) && {
                        fill: "currentColor",
                      }),
                    }}
                  />
                </Button>
              </CircularProgressbarWithChildren>
            </div>
          ) : (
            <div>
              <Button
                size="rounded"
                variant={locked ? "locked" : "secondary"}
                className="h-[70px] w-[70px] border-b-8"
              >
                <Icon
                  className={cn(
                    "w-10 h-10",
                    locked
                      ? " fill-neutral-400 text-neutral-400 stroke-neutral-400"
                      : "fill-primary-foreground text-primary-foreground",
                    isCompleted && "fill-none stroke-[4]"
                  )}
                  style={{
                    height: "2rem",
                    width: "2rem",
                  }}
                />
              </Button>
            </div>
          )}
        </Link>
      )}
    </div>
  );
};
