import { Inject, Injectable } from "@nestjs/common";
import { CONFIG_OPTIONS } from "src/common/common.constants";
import { MailModuleOptions } from "./mail.interface";
import got from "got";
import * as FormData from "form-data";
@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions
  ) {}
  async sendEmail(email: string, code: string): Promise<Boolean> {
    const form = new FormData();
    form.append("from", `Excited User <Nuber@mailgun-test.com>`);
    form.append("to", email);
    form.append("template", "nuber_alert");
    form.append("subject", "hello world");
    form.append(
      "h:X-Mailgun-Variables",
      `{"code":"${code}","userName":"${email}"}`
    );
    try {
      await got.post(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`
            ).toString("base64")}`,
          },
          body: form,
        }
      );
      return true;
    } catch (error) {
      return false;
    }
  }
  sendVerificationEmail(email: string, code: string) {
    this.sendEmail("giyoung914@gmail.com", code);
  }
}
