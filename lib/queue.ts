import { R2_BUCKET } from "@/r2";

// Must match the queue the transcoder consumes (transcoder-rs/src/amqp.rs).
const QUEUE = "transcode-jobs";

// Publishes a transcode job to CloudAMQP (LavinMQ) through its HTTP API.
// ponytail: HTTP publish instead of an AMQP client, which avoids a socket per serverless
// request. Switch to amqplib with a shared channel if publish volume ever matters.
export async function enqueueTranscode(videoId: string) {
  if (!process.env.AMQP_URL) {
    throw new Error("Missing AMQP_URL. Please set it in your .env file.");
  }
  // amqps://user:pass@host/vhost -> https://host/api/exchanges/vhost/amq.default/publish
  const amqp = new URL(process.env.AMQP_URL);
  const vhost = amqp.pathname.slice(1) || "%2F";
  const auth = Buffer.from(
    `${decodeURIComponent(amqp.username)}:${decodeURIComponent(amqp.password)}`
  ).toString("base64");

  const res = await fetch(`https://${amqp.hostname}/api/exchanges/${vhost}/amq.default/publish`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      routing_key: QUEUE,
      properties: { delivery_mode: 2, content_type: "application/json" }, // persistent
      payload_encoding: "string",
      // same shape as an R2 event notification
      payload: JSON.stringify({
        action: "PutObject",
        bucket: R2_BUCKET,
        object: { key: `raw/${videoId}` },
      }),
    }),
  });

  if (!res.ok) {
    throw new Error(`AMQP publish failed: ${res.status} ${await res.text()}`);
  }
  // unroutable = queue missing; the message would be silently dropped
  if (!(await res.json()).routed) {
    throw new Error(`AMQP publish not routed: queue "${QUEUE}" does not exist`);
  }
}
