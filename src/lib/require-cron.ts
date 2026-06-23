// Vercel Cron calls these routes with `Authorization: Bearer ${CRON_SECRET}`.
// https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs
export function requireCron(request: Request) {
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}
