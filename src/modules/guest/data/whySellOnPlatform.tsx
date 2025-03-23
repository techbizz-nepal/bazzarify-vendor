import { GrGraphQl } from "react-icons/gr";
import { FaHandHoldingHeart } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";
import { GiPayMoney, GiSkills } from "react-icons/gi";
import { IoMdMegaphone } from "react-icons/io";
import { TWhySellOnPlatform } from "@/modules/guest";

export const whySellOnPlatform: TWhySellOnPlatform[] = [
  {
    id: "01-wider-reach",
    title: "Wider Reach",
    description:
      "Connect with thousands of customers and expand your business on Nepal’s growing e-commerce platform.",
    icon: <GrGraphQl className="size-16 md:size-44 text-primary" />,
  },
  {
    id: "02-free-sign-up",
    title: "Free Signup",
    description:
      "Create your account and start listing products at no cost – easy and hassle-free!",
    icon: <FaHandHoldingHeart className="size-16 md:size-44 text-primary" />,
  },
  {
    id: "03-reliable-delivery",
    title: "Reliable Delivery",
    description:
      "Fast, secure, and efficient delivery with our trusted logistics partners.",
    icon: <TbTruckDelivery className="size-16 md:size-44 text-primary" />,
  },
  {
    id: "04-timely-payouts",
    title: "Timely Payouts",
    description:
      "Get your earnings directly deposited into your bank account on a regular basis.",
    icon: <GiPayMoney className="size-16 md:size-44 text-primary" />,
  },
  {
    id: "05-marketing-support",
    title: "Marketing Support",
    description:
      "Boost your sales with our promotional tools and targeted advertising solutions.",
    icon: <IoMdMegaphone className="size-16 md:size-44 text-primary" />,
  },
  {
    id: "06-seller-assistance-and-training",
    title: "Seller Assistance & Training",
    description:
      "Learn, grow, and succeed with our expert guidance and seller support system.",
    icon: <GiSkills className="size-16 md:size-44 text-primary" />,
  },
];
