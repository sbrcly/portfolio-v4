# The extension's backend service

Written from the source for the design round. No hosts, keys, or account identifiers; nothing here is to be quoted on a page.

## What it is

A single Node and Express service that the Chrome extension calls. It runs beside the pricing portal's backend but is separate from it, and it does four jobs. The one that matters for the featured page is the verification-code relay.

## The verification-code relay

Ticketmaster asks a buyer for a one-time code before some steps, most importantly before entering the queue for a large on-sale. The code arrives by email or by text message. The extension detects the request on the page and asks this service for the code; the service gets it from one of two paths and returns it; the extension shows it on the page and copies it to the clipboard.

**The email path.** A Python mail hook (see EMAIL_HOOK_NOTES.md) writes the latest code per address into a Postgres table. The service reads it from there.

**The phone path.** The company's phone lines sat behind a third-party SMS gateway. The gateway exposes hundreds of ports, grouped under gateway IDs, and only one port in a group can be open at a time. A text message only arrives on an open port. So getting a code for a given line means opening that line's port, waiting for the message, and closing it again, without two requests in the same group fighting over the port.

The service does this with three in-memory structures: a port-state map (gateway, group, open or closed), a per-group queue of waiting requests, and a per-group record of which line is currently being served. Each day it refreshes its list of lines from the gateway (a cron at a fixed hour, written to a local file). On a request for a line:

1. If a code for that line arrived in the last fifteen minutes, return it at once and release the port.
2. If the line's group already has a port open for another line, the request is queued, and the HTTP response is held open so the caller gets the code when its turn comes.
3. Otherwise the service marks the group open, asks the gateway to reset the port for that line, and polls the code store every ten seconds for up to ninety seconds.
4. On a code or a timeout it marks the group closed and drains the next request in the group's queue, which repeats from step 3.

Codes arrive by a webhook the gateway calls on every inbound message. The service writes every message to a store, and messages from the known sender number are also written to a codes collection keyed by the destination line, which is what the poll reads. The code store moved from an in-process map to Firestore so a restart would not lose codes mid-sale; the old path is kept in comments.

A status route exposes the port-state map and the queues for debugging during an on-sale.

## The other three jobs

- **Warehouse reads for the Shader.** Two routes run BigQuery queries for the portal's rule-authoring panel: the scrape-snapshot timeline for an event and the per-seat history (first seen, last seen, latest price, whether the seat is gone). A third route fetches a stored snapshot's raw HTML from object storage.
- **Warehouse writes.** A route that stringifies non-string fields and streams a row into a named BigQuery table through the company's internal streaming endpoint, which is how the extension's telemetry reaches the warehouse.
- **Generic Firestore read and write routes**, and a webhook receiver for the company's point-of-sale vendor that enriches invoice events before storing them.

There is also an export route that filters the stored emails by subject or body text and returns a CSV.

## Reviewer's notes

Strengths: the port scheduler is a correct single-open-port-per-group discipline with a queue, held responses, a bounded poll, and a release on every exit path, including failure. The fifteen-minute check-first avoids opening a port when the code is already there. Weaknesses a reviewer would raise: state is in process memory, so a restart loses the queues; the API-key middleware is present but disabled; the daily line list is a local JSON file; and the warehouse query routes interpolate a request parameter into SQL. None of this needs to be on the page; it should be answerable in an interview.
