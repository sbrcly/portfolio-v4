# The email hook

Written from the source for the design round. No hosts, credentials, or addresses; nothing here is to be quoted on a page.

## What it is

One Python script, about 330 lines, that ran on a virtual machine in Google Cloud. The machine's mail server was configured to pipe every message sent to one address into the script on standard input, so the script ran once per email, with no daemon and no polling. It does two jobs: it gets verification codes out of inbound email into the store the extension's backend polls, and it turns sale-confirmation emails from the point-of-sale vendor into warehouse rows.

## The code path

1. The raw message arrives on stdin. The script parses it with the standard library's email parser: headers, then the body, taking the plain-text part if there is one and otherwise stripping the HTML part down to text with BeautifulSoup. Bytes are decoded with replacement so a bad character never drops a message.
2. Every message, code or not, is appended to an all-emails table in Postgres (received time, recipient, subject, body). That table is what the backend's CSV export reads.
3. If the body carries the marketplace's code phrase followed by six digits, the code is upserted into a second table keyed on the recipient address: one row per address, latest code wins, so the backend's lookup is a single read by address with no ordering or cleanup.
4. Every field is extracted inside its own try block, so a malformed header never prevents the body being stored, and a missing body never prevents the code being stored.

The backend then serves that table to the extension on request. The email path is the simpler of the two relays; the phone path (EXTENSION_API_NOTES.md) needed the port scheduler because text messages only arrive on an open port.

## The point-of-sale feed

When the subject marks a sale confirmation, the script parses the order out of the body with one regular expression per field (invoice, event, venue, date, section, row, seats, ship date, quantity, merchandise, discount, gift certificate, service charge, shipping, tax, total, notes, and the masked payment method), eighteen fields in all, and streams the row into a BigQuery table with the warehouse client. Prices are matched with or without a currency prefix because some orders are in Canadian dollars. A message that yields no fields is logged and skipped rather than written empty.

## Logging

A file log on the machine, appended per message with what was extracted and what was written; if the log file cannot be opened the script falls back to stderr rather than failing.

## Reviewer's notes

Strengths: per-field isolation of failures, the upsert so the latest code wins without a cleanup job, decode-with-replacement, and the fact that the point-of-sale parser handles two currencies. Weaknesses a reviewer would raise: the tables are created with an if-not-exists statement on every call and a new connection is opened per write (both cheap at one email at a time, but not how a steady-state script should be written); headers are re-parsed from the raw text with regular expressions when the parsed message object already has them; the warehouse client is constructed per call; and there are no tests. The honest interview answer is that it was a mail hook written in an afternoon to unblock a sale, hardened field by field as emails broke it, and never had the volume to justify more.
