// Accounts that can see My videos / Upload / Create. Used by client and server components.
const UPLOADER_EMAILS = ["pink53906@gmail.com", "rushikesh.pawar@fitsol.green"];

export function canUpload(email?: string | null) {
  return !!email && UPLOADER_EMAILS.includes(email);
}
