import {Metadata} from "next";
import VendorRegistrationForm from "@/modules/guest/components/client/VendorRegistrationForm";
import Header from "@/modules/guest/components/client/registration/Header";
import WhySellOnBazzarify from "@/modules/guest/components/client/registration/WhySellOnBazzarify";

export const metadata: Metadata = {
    title: "Register",
    description: "Register account",
};

export default function Page() {
    return (
        <div className="w-full h-screen flex-col py-2 space-y-6">
            <Header/>
            <VendorRegistrationForm/>
            <WhySellOnBazzarify/>
        </div>
    );
}
