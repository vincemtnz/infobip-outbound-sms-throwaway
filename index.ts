import { Infobip, AuthType } from "@infobip-api/sdk";

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;
const SENDER_ID = process.env.SENDER_ID;
const NOTIFY_URL = process.env.NOTIFY_URL;

if (!API_KEY) {
  throw new Error("API_KEY is required");
}
if (!BASE_URL) {
  throw new Error("BASE_URL is required");
}

let client = new Infobip({
  authType: AuthType.ApiKey,
  baseUrl: BASE_URL ?? "",
  apiKey: API_KEY,
});

const recipients = await Bun.file("./recipients.json").json<
  Array<{ name: string; number: string }>
>();

const payload = {
  messages: recipients.map((recipient) => ({
    destinations: [{ to: recipient.number }],
    from: SENDER_ID,
    notifyUrl: NOTIFY_URL,
    notifyContentType: "application/json",
    validityPeriod: 5, // in minutes
    text: `Hi ${recipient.name}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    callbackData: JSON.stringify({ foo: "bar" }),
  })),
};
console.log("\nREQUEST:");
console.log(Bun.inspect(payload, { colors: true }));

const response = await client.channels.sms.send(payload).catch(console.error);
console.log("\nRESPONSE:");
console.log(Bun.inspect(response.data, { colors: true }));
