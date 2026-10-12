import { consentRecord } from '@/lib/legal';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export function GET(){const {hash,version}=consentRecord();return Response.json({hash,version},{headers:{'Cache-Control':'no-store'}});}
