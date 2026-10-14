# IMP diagram storage

Diagrams are private S3-compatible objects. The IMP's existing Markdown body stores
`![Description](/api/imp-diagrams/<generated-name>.png)`, not a public bucket URL.
No new database columns or migrations are required. This implementation supports
manual diagram placement; the existing content parser's diagram-description notes
remain unchanged and may be replaced with uploaded images after operator review.

## Operator workflow

In either the general catalog editor or farm-specific IMP editor, choose **Insert
a diagram**, select a PNG/JPEG/WebP up to 512 KiB, enter meaningful alt text, then
**Upload and insert diagram**. Preview the body and save the IMP separately. A
failed upload leaves the form and description intact. The server checks file bytes
and creates the object name; browser filenames, MIME types, keys and ACLs are not
trusted. SVG, HTML, PDF and other active/document formats are not accepted.

Copy the returned Markdown into the authoritative spreadsheet's Body cell when
editing a general practice, then reconcile as described in [General IMP
operations](general-imps.md). Reimports preserve the stored diagram reference as
part of the body. Uploading does not itself publish an IMP or generate advice.

## Server configuration

Set these server-only variables in **both** the internal app and client site:

| Variable                        | Purpose                                                             |
| ------------------------------- | ------------------------------------------------------------------- |
| `IMP_DIAGRAM_BUCKET`            | Existing private bucket                                             |
| `IMP_DIAGRAM_REGION`            | Provider's S3 region; R2 uses `auto`                                |
| `IMP_DIAGRAM_ACCESS_KEY_ID`     | Scoped storage credential                                           |
| `IMP_DIAGRAM_SECRET_ACCESS_KEY` | Scoped storage secret                                               |
| `IMP_DIAGRAM_ENDPOINT`          | Optional HTTPS S3-compatible endpoint; omit for AWS                 |
| `IMP_DIAGRAM_PREFIX`            | Optional object prefix, default `imp-diagrams`                      |
| `IMP_DIAGRAM_FORCE_PATH_STYLE`  | `true` when the provider/local fixture requires path-style requests |

The internal app needs `PutObject` and `GetObject` for the prefix; the client app
needs only `GetObject`. Use separate credentials with those respective permissions.
No bucket creation, ACL, public-read, list, delete or browser CORS permissions are
required by the app. Keep the bucket private. Never use `NEXT_PUBLIC_*` for storage
secrets. Credentials are explicit; the SDK does not discover local/cloud accounts.
HTTP endpoints are rejected except on loopback for disposable development fixtures.

Provider setup references: [AWS SDK v3 S3 examples](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html)
and [Cloudflare R2 AWS SDK v3 configuration](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/).
For DigitalOcean Spaces, use its S3-compatible endpoint and region with an existing
private bucket and prefix-scoped credentials.

## Access and lifecycle

Internal reads and uploads independently require an authenticated active internal
account; API routes bypass the apps' proxy matchers. Client reads require an
authenticated approved farm, the existing Viewer agreement gate when applicable,
and a diagram reference in a general practice/shared plan or a plan belonging to
that farm's management zone. Unpublished objects and other farms' plan-only
references return 404 before storage is read. Images use byte-derived content
types, `nosniff` and `private, no-store` caching. Object names cannot address other
prefixes or traverse paths. Storage requests time out after ten seconds.

Canceling an edit or removing a Markdown reference does not delete the object.
Use the provider's lifecycle/retention controls and a reviewed reference inventory
to clean abandoned uploads; do not expire still-referenced diagrams. The app
intentionally has no client deletion operation. Keep any source diagram files and
spreadsheet snapshots needed for recovery.

## Local verification and deployment prerequisite

Use an isolated S3-compatible server bound to `127.0.0.1`, a disposable bucket and
synthetic credentials. Set the endpoint to its local HTTP URL, enable path style,
and run both apps against synthetic local auth/database fixtures. Verify upload →
private object → Markdown save → authenticated client image, then denied anonymous
and wrong-farm reads, invalid files, and storage-unavailable behavior. No production
data or migrations are needed.

Deployment requires an already provisioned private bucket and appropriately scoped
credentials configured in both apps. This change does not provision an account or
bucket. Local compatibility checks do not verify an unconfigured live provider,
its IAM policy or its retention settings.
