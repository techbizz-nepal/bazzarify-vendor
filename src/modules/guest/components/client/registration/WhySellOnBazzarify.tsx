import SectionTitle from "@/modules/core/components/server/SectionTitle";
import { whySellOnPlatform } from "@/modules/guest/data/whySellOnPlatform";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const WhySellOnBazzarify = () => (
  <div className="flex flex-col space-y-10 px-3 md:px-24">
    <SectionTitle
      className="flex justify-center items-center"
      label="Why sell on Bazzarify ?"
    />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {whySellOnPlatform.map((item) => (
        <Card key={item.id} className="px-4 items-center justify-center ">
          {item.icon}
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </Card>
      ))}
    </div>
  </div>
);
export default WhySellOnBazzarify;
