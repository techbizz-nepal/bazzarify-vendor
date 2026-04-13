import assert from "node:assert/strict";
import { ResetPasswordFormSchema } from "../../src/modules/guest/config/schemas/reset.password.form";
import { ResetPasswordVerificationFormSchema } from "../../src/modules/guest/config/schemas/reset.password.verification.form";
import {
  buildPasswordResetVerificationHref,
  toPasswordResetVerificationPayload,
} from "../../src/modules/guest/utils/passwordReset";

const validResetRequest = ResetPasswordFormSchema.safeParse({
  email: "vendor@example.com",
  phone: "9812345678",
});
assert.equal(validResetRequest.success, true);

const invalidResetRequest = ResetPasswordFormSchema.safeParse({
  email: "vendor@example.com",
  phone: "1234",
});
assert.equal(invalidResetRequest.success, false);

const validResetVerification = ResetPasswordVerificationFormSchema.safeParse({
  phone: "9812345678",
  otp: "123456",
  password: "SecurePass1!",
  password_confirmation: "SecurePass1!",
});
assert.equal(validResetVerification.success, true);

const invalidResetVerification = ResetPasswordVerificationFormSchema.safeParse({
  phone: "9812345678",
  otp: "123456",
  password: "SecurePass1!",
  password_confirmation: "AnotherPass1!",
});
assert.equal(invalidResetVerification.success, false);

assert.equal(
  buildPasswordResetVerificationHref("9812345678"),
  "/verify-otp?phone=9812345678",
);

assert.deepEqual(
  toPasswordResetVerificationPayload({
    phone: "9812345678",
    otp: "123456",
    password: "SecurePass1!",
    password_confirmation: "SecurePass1!",
  }),
  {
    phone: "9812345678",
    verification_code: "123456",
    password: "SecurePass1!",
    password_confirmation: "SecurePass1!",
  },
);

console.log("password reset vendor assertions passed");
