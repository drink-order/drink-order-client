// import { notifications } from "../../libs/mockData";

// export default function handler(req, res) {
//   res.status(200).json(notifications);
// }


import { NextResponse } from "next/server";
import { notifications } from "../../libs/mockData";

export async function GET() {
  return NextResponse.json(notifications);
}

export async function POST(req) {
    const newNotification = await req.json();
    notifications.push(newNotification); // Add new notification
    return NextResponse.json({ message: "Notification added!" });
  }