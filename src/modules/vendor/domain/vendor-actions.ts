"use server";

import { BusinessAndEmailFormValues } from "@/modules/guest/config/schemas/set.business.email.form";

export async function actionCreateStore(data: BusinessAndEmailFormValues) {
  return true;
}
