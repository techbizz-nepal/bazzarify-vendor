import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import SectionTitle from "@/modules/core/components/server/SectionTitle";
import { whySellOnPlatform } from "@/modules/guest/data/whySellOnPlatform";

const WhySellOnBazzarify = () => (
  <div className="flex flex-col space-y-10 px-3 md:px-24">
    <SectionTitle
      className="flex items-center justify-center"
      label="Why sell on Bazzarify ?"
    />
    <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
      {whySellOnPlatform.map((item) => (
        <Card key={item.id} className="items-center justify-center px-4">
          {item.icon}
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </Card>
      ))}
    </div>
  </div>
);
export default WhySellOnBazzarify;
