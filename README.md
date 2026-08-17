# Credits

[Bartosz Jarocki](https://github.com/BartoszJarocki/cv/)

# Minimalist CV

Simple web app that renders minimalist CV with print-friendly layout.
Built with Next.js and shadcn/ui. [Click here to see website](https://jnjoroge.dev/)

# Environment variables

The contact chat (`POST /api`) emails each submission over Gmail SMTP.

| Variable                   | Required | Notes                                                                                                                             |
| -------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `GMAIL_USER`               | yes      | The Gmail address that sends the notification.                                                                                    |
| `GMAIL_APP_PASSWORD`       | yes      | A 16-character [app password](https://myaccount.google.com/apppasswords), not the account password. Requires 2-Step Verification. |
| `CONTACT_TO_EMAIL`         | no       | Where inquiries land. Defaults to `GMAIL_USER`.                                                                                   |
| `UPSTASH_REDIS_REST_URL`   | yes\*    | Rate limiting (3 submissions / 24h per IP). `KV_REST_API_URL` is also accepted.                                                   |
| `UPSTASH_REDIS_REST_TOKEN` | yes\*    | Paired with the URL above. `KV_REST_API_TOKEN` is also accepted.                                                                  |
| `SMTP_HOST` / `SMTP_PORT`  | no       | Local testing only — points the transport at another SMTP server instead of Gmail.                                                |

\* Without a Redis store the route returns 503 in production rather than
accepting unthrottled submissions. In development it simply skips the limit.

# License

[MIT](https://choosealicense.com/licenses/mit/)
