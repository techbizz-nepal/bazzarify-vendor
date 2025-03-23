"use client";

import {useForm, UseFormReturn} from "react-hook-form";
import {VerifyOtpFormSchema, VerifyOtpFormValues,} from "@/modules/guest/config/schemas/verify.otp.form";
import FormTitle from "@/modules/core/components/server/FormTitle";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot,} from "@/components/ui/input-otp";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter, useSearchParams} from "next/navigation";
import {REGEXP_ONLY_DIGITS} from "input-otp";
import {use, useEffect} from "react";
import {SessionContext} from "@/modules/core/contexts/SessionContextProvider";

interface IVerifyOTPForm {
    className?: string;
    formTitle: string;
    formHelpText: string;
    buttonLabel: string;
    onSubmitAction: (data: VerifyOtpFormValues) => void;
    form: UseFormReturn<{
        otp: string;
        password: string;
        password_confirmation: string;
    }>;
}

export default function VerifyOTPForm({
                                          className,
                                          formTitle,
                                          formHelpText,
                                          buttonLabel,
                                          onSubmitAction,
    form
                                      }: IVerifyOTPForm) {
    const router = useRouter();
    const urlSearchParams = useSearchParams();
    const sessionCtx = use(SessionContext);
    if (!sessionCtx) {
        throw new Error("SessionProvider must be used in correct place.");
    }

    const {session} = sessionCtx;

    useEffect(() => {
        if (session) {
            return router.replace("/");
        }
        const phone = urlSearchParams.get("phone")?.trim() || "";
        if (!phone || !/^9\d{9}$/.test(phone)) {
            throw new Error("403");
        }
    }, [router, session, urlSearchParams]);
    return (
        <div className={className}>
            <FormTitle
                label={formTitle}
                helpText={formHelpText}
                className="flex w-full items-center justify-center"
            />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmitAction)}
                    className="flex-col space-y-6"
                >
                    <FormField
                        render={({field}) => (
                            <FormItem className="flex flex-col gap-y-2">
                                <FormControl>
                                    <InputOTP
                                        autoComplete={""}
                                        pattern={REGEXP_ONLY_DIGITS}
                                        containerClassName="flex items-center justify-center w-full"
                                        maxLength={6}
                                        {...field}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot className="w-14 h-12" index={0}/>
                                            <InputOTPSlot className="w-14 h-12" index={1}/>
                                            <InputOTPSlot className="w-14 h-12" index={2}/>
                                        </InputOTPGroup>
                                        <InputOTPSeparator/>
                                        <InputOTPGroup>
                                            <InputOTPSlot className="w-14 h-12" index={3}/>
                                            <InputOTPSlot className="w-14 h-12" index={4}/>
                                            <InputOTPSlot className="w-14 h-12" index={5}/>
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        name="otp"
                    />
                    <FormField
                        render={({field}) => (
                            <FormItem className="flex flex-col gap-y-2">
                                <FormLabel className="text-slate-500">Password</FormLabel>
                                <FormControl>
                                    <Input
                                        autoComplete="new-password"
                                        className="border border-slate-300 placeholder:text-slate-400 accent-orange-600"
                                        type="password"
                                        placeholder="Enter password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        name="password"
                    />
                    <FormField
                        render={({field}) => (
                            <FormItem className="flex flex-col gap-y-2">
                                <FormLabel className="text-slate-500">
                                    Confirm Password
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        autoComplete="new-password"
                                        className="border border-slate-300 placeholder:text-slate-400 accent-orange-600"
                                        type="password"
                                        placeholder="Confirm password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        name="password_confirmation"
                    />
                    <Button
                        className="w-full text-md py-6 cursor-pointer"
                    >
                        {buttonLabel}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
