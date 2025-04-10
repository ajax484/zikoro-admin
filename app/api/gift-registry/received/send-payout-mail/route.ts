
import { TOrganizationTeamMember } from "@/typings/organization";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const params = await req.json();

      const { payoutRef, amount, members } = params;

      const teamMembers: TOrganizationTeamMember[] = members;

      var { SendMailClient } = require("zeptomail");

      let client = new SendMailClient({
        url: process.env.NEXT_PUBLIC_ZEPTO_URL,
        token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
      });

      const date = new Date();

      teamMembers?.forEach(async (member) => {
        try {
          const resp = await client.sendMail({
            from: {
              address: process.env.NEXT_PUBLIC_EMAIL,
              name: "Zikoro",
            },
            to: [
              {
                email_address: {
                  address: member.userEmail,
                  name: "User",
                },
              },
            ],
            subject: `Payout Completed: ${payoutRef}`,
            htmlbody: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333; margin: 0; padding: 20px 0px;">
            <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; padding: 10px 0;">
                    <img src=${"/zikoro.png"} alt="Company Logo" style="max-width: 150px;">
                </div>
                <div style="margin: 20px 0;">
                    <h1 style="margin-bottom: 20px;">Payout Requested</h1>
                    <p>Hello there,</p>
                    <p>Here's information on your requested payout: <span style="color: #001FCC; font-weight: bold;">NGN${amount}</span>.</p>
                    <p>Transaction Details:</p>
                    <ul style="line-height: 1.6; margin: 20px 0; padding-left: 20px;">
                        <li><strong>Payout Amount:</strong> NGN${amount}</li>
                        <li><strong>Transaction ID:</strong> ${payoutRef}</li>
                        <li><strong>Payout Date:</strong> ${
                          date.getMonth() + 1
                        }/${date.getDate()}/${date.getFullYear()}</li>
                    </ul>
                    <p>If you have any questions or concerns, please feel free to <a href="mailto:support@example.com" style="color: #001FCC; text-decoration: none;">contact our support team</a>.</p>
                    <p>Thank you for using our services.</p>
                    <p>Sincerely,<br>The Zikoro Team</p>
                </div>
                <div style="text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #dddddd; color: #777777;">
                    <p>&copy; ${date.getFullYear()} Zikoro. All rights reserved.</p>
                </div>
            </div>
        </body>
        `,
          });

          console.log("Email sent to" + resp);
        } catch (error) {
          console.log("error sending mails" + error);
        }
      });

      return NextResponse.json(
        { msg: "Gift Recieved created successfully" },
        {
          status: 201,
        }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          error: error,
        },
        {
          status: 500,
        }
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" });
  }
}

export const dynamic = "force-dynamic";
