# Deployment

## Environments

- Local dev: `npm run dev`
- Production: `npm run build` then `npm run start`

## Env Vars

- Use `.env.local` for local development.
- See `frontend/README.md` for CMS mode variables.

## Notes

- Payload + Next can be deployed together or separately.
- Ensure database credentials and Clerk keys are set in the target environment.
